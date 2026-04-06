import { useCallback, useDeferredValue, useEffect, useRef, useState } from "react";
import BalanceBars from "./components/BalanceBars";
import CalendarPanel from "./components/CalendarPanel";
import CategoryChart from "./components/CategoryChart";
import FiltersBar from "./components/FiltersBar";
import Header from "./components/Header";
import InsightsPanel from "./components/InsightsPanel";
import InvoicesPanel from "./components/InvoicesPanel";
import ScrollIntro from "./components/ScrollIntro";
import Sidebar from "./components/Sidebar";
import SummaryCard from "./components/SummaryCard";
import TransactionModal from "./components/TransactionModal";
import TransactionTable from "./components/TransactionTable";
import TrendChart from "./components/TrendChart";
import { useAppContext } from "./context/AppContext";
import {
  filterTransactions,
  getCategoryBreakdown,
  getCategoryGroups,
  getInsights,
  getMonthlySeries,
  getSummary,
  sortTransactions,
} from "./utils/dashboard";
import { formatCurrency } from "./utils/formatters";

function LoadingDashboard() {
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="panel min-h-[152px]">
            <div className="skeleton h-full w-full" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 2xl:grid-cols-[1.7fr,0.8fr]">
        <div className="panel min-h-[420px]">
          <div className="skeleton h-full min-h-[360px] w-full" />
        </div>
        <div className="panel min-h-[420px]">
          <div className="skeleton h-full min-h-[360px] w-full" />
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.9fr,1.1fr]">
        <div className="grid gap-4">
          <div className="panel min-h-[220px]">
            <div className="skeleton h-full min-h-[180px] w-full" />
          </div>
          <div className="panel min-h-[320px]">
            <div className="skeleton h-full min-h-[280px] w-full" />
          </div>
        </div>
        <div className="panel min-h-[560px]">
          <div className="skeleton h-full min-h-[520px] w-full" />
        </div>
      </div>
    </div>
  );
}

function getMetricChange(current, previous) {
  if (!previous) {
    return 0;
  }

  return ((current - previous) / Math.max(Math.abs(previous), 1)) * 100;
}

export default function App() {
  const appName = "Finlytics";
  const {
    state,
    setTheme,
    setRole,
    setFilters,
    resetFilters,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [activeNavItem, setActiveNavItem] = useState("overview");
  const [chartWindow, setChartWindow] = useState("Yearly");
  const [spendingWindow, setSpendingWindow] = useState("30d");
  const [calendarMonth, setCalendarMonth] = useState(new Date("2026-04-01"));
  const [selectedMetric, setSelectedMetric] = useState("balance");
  const [showIntro, setShowIntro] = useState(true);
  const overviewRef = useRef(null);
  const revenueRef = useRef(null);
  const calendarRef = useRef(null);
  const insightsRef = useRef(null);
  const spendingRef = useRef(null);
  const transactionsRef = useRef(null);

  const deferredSearch = useDeferredValue(state.filters.search);
  const effectiveFilters = {
    ...state.filters,
    search: deferredSearch,
  };

  const categories = [...new Set(state.transactions.map((item) => item.category))].sort();
  const categoryGroups = getCategoryGroups(categories);
  const filteredTransactions = sortTransactions(
    filterTransactions(state.transactions, effectiveFilters),
    state.filters.sortBy,
  );
  const summary = getSummary(filteredTransactions);
  const monthlySeries = getMonthlySeries(filteredTransactions);
  const insights = getInsights(filteredTransactions);
  const latestMonth = monthlySeries[monthlySeries.length - 1];
  const previousMonth = monthlySeries[monthlySeries.length - 2];
  const latestTransactionDateKey = filteredTransactions.length
    ? [...filteredTransactions].sort(
        (left, right) => new Date(right.date) - new Date(left.date),
      )[0].date
    : "2026-04-05";
  const latestTransactionDate = new Date(latestTransactionDateKey);

  const chartSeries = (() => {
    if (chartWindow === "Weekly") {
      return monthlySeries.slice(-4);
    }

    if (chartWindow === "Monthly") {
      return monthlySeries.slice(-6);
    }

    if (chartWindow === "Yearly") {
      return monthlySeries.slice(-12);
    }

    return monthlySeries;
  })();

  const spendingTransactions = (() => {
    if (spendingWindow === "all") {
      return filteredTransactions;
    }

    const days = spendingWindow === "30d" ? 30 : 90;
    const cutoff = new Date(latestTransactionDate);
    cutoff.setDate(cutoff.getDate() - days);

    return filteredTransactions.filter(
      (transaction) => new Date(transaction.date) >= cutoff,
    );
  })();

  const categoryBreakdown = getCategoryBreakdown(spendingTransactions);
  const invoiceTransactions = filteredTransactions.filter(
    (transaction) => transaction.type === "expense",
  );
  const pendingTransactions = filteredTransactions.filter(
    (transaction) => transaction.status === "pending",
  );
  const selectedCalendarDate =
    state.filters.startDate &&
    state.filters.endDate &&
    state.filters.startDate === state.filters.endDate
      ? state.filters.startDate
      : "";

  const summaryChanges = {
    balance: getMetricChange(latestMonth?.net || 0, previousMonth?.net || 0),
    income: getMetricChange(latestMonth?.income || 0, previousMonth?.income || 0),
    expenses: getMetricChange(latestMonth?.expenses || 0, previousMonth?.expenses || 0),
  };
  const averageExpense =
    invoiceTransactions.length > 0
      ? invoiceTransactions.reduce((total, transaction) => total + transaction.amount, 0) /
        invoiceTransactions.length
      : 0;
  const strongestNetMonth = [...monthlySeries].sort((left, right) => right.net - left.net)[0];
  const metricHighlights = [
    {
      label: "Transactions tracked",
      value: filteredTransactions.length,
      detail: "Loaded across the active workspace window",
    },
    {
      label: "Pending reviews",
      value: pendingTransactions.length,
      detail: "Expenses and items still marked pending",
    },
    {
      label: "Highest spending",
      value: insights.topCategory?.category || "No data",
      detail: insights.topCategory
        ? `${insights.topCategory.category} at ${formatCurrency(insights.topCategory.amount)}`
        : "No expense data in this view",
    },
    {
      label: "Average expense",
      value: formatCurrency(averageExpense),
      detail: strongestNetMonth
        ? `Best month: ${strongestNetMonth.label}`
        : "Waiting for more monthly data",
    },
  ];

  const hasActiveFilters = Object.entries(state.filters).some(([key, value]) => {
    if (key === "sortBy") {
      return value !== "date-desc";
    }

    if (key === "groupBy") {
      return value !== "none";
    }

    if (key === "categoryGroup") {
      return value !== "all";
    }

    return value !== "" && value !== "all";
  });

  function handleToggleTheme() {
    setTheme(state.theme === "dark" ? "light" : "dark");
  }

  const handleIntroComplete = useCallback(() => {
    setTheme("dark");
    setShowIntro(false);
  }, [setTheme]);

  function openCreateModal() {
    setEditingTransaction(null);
    setIsModalOpen(true);
  }

  function openEditModal(transaction) {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  }

  function closeModal() {
    setEditingTransaction(null);
    setIsModalOpen(false);
  }

  function handleSubmitTransaction(transaction) {
    if (editingTransaction) {
      updateTransaction(transaction);
    } else {
      addTransaction(transaction);
    }

    closeModal();
  }

  function handleDeleteTransaction(transactionId) {
    deleteTransaction(transactionId);

    if (editingTransaction?.id === transactionId) {
      closeModal();
    }
  }

  function shiftCalendarMonth(direction) {
    setCalendarMonth((current) => {
      const next = new Date(current);
      next.setMonth(current.getMonth() + direction);
      return next;
    });
  }

  function handleChangeSpendingWindow(nextWindow) {
    setSpendingWindow(nextWindow);
  }

  function handleExportCsv() {
    const headers = ["Date", "Title", "Category", "Type", "Status", "Amount", "Note"];
    const rows = filteredTransactions.map((transaction) => [
      transaction.date,
      transaction.title,
      transaction.category,
      transaction.type,
      transaction.status,
      transaction.amount,
      transaction.note,
    ]);
    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "finlytics-transactions.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleExportJson() {
    const json = JSON.stringify(filteredTransactions, null, 2);
    const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "finlytics-transactions.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleSummaryCardClick(metric) {
    setSelectedMetric(metric);

    if (metric === "income") {
      setFilters({ type: "income" });
      scrollToSection("transactions");
      return;
    }

    if (metric === "expenses") {
      setFilters({ type: "expense" });
      scrollToSection("transactions");
      return;
    }

    setFilters({ type: "all" });
    scrollToSection("revenue");
  }

  function handleSelectCalendarDate(isoDate) {
    if (selectedCalendarDate === isoDate) {
      setFilters({ startDate: "", endDate: "" });
      return;
    }

    setCalendarMonth(new Date(`${isoDate}T00:00:00`));
    setFilters({ startDate: isoDate, endDate: isoDate });
    scrollToSection("transactions");
  }

  function handleClearDrilldowns() {
    setSelectedMetric("balance");
    resetFilters();
  }

  function scrollToSection(sectionId) {
    const targets = {
      overview: overviewRef,
      revenue: revenueRef,
      calendar: calendarRef,
      insights: insightsRef,
      spending: spendingRef,
      invoices: transactionsRef,
      controls: transactionsRef,
      transactions: transactionsRef,
    };

    setActiveNavItem(sectionId);
    targets[sectionId]?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  useEffect(() => {
    document.title = `${appName} Dashboard`;
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setIsLoading(false), 900);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    setCalendarMonth(
      new Date(latestTransactionDate.getFullYear(), latestTransactionDate.getMonth(), 1),
    );
  }, [latestTransactionDateKey]);

  useEffect(() => {
    const sectionEntries = [
      { id: "overview", element: overviewRef.current },
      { id: "revenue", element: revenueRef.current },
      { id: "calendar", element: calendarRef.current },
      { id: "insights", element: insightsRef.current },
      { id: "spending", element: spendingRef.current },
      { id: "transactions", element: transactionsRef.current },
    ].filter((entry) => entry.element);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        if (visibleEntry) {
          const match = sectionEntries.find((entry) => entry.element === visibleEntry.target);
          if (match) {
            setActiveNavItem(match.id);
          }
        }
      },
      {
        threshold: [0.25, 0.45, 0.65],
        rootMargin: "-12% 0px -35% 0px",
      },
    );

    for (const entry of sectionEntries) {
      observer.observe(entry.element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-500">
      {showIntro ? (
        <ScrollIntro onComplete={handleIntroComplete} />
      ) : null}

      <div className="relative min-h-screen p-0">
        <div className="min-h-screen w-full border border-[var(--shell-border)] bg-[var(--bg-main)] px-3 py-3 sm:px-4 sm:py-4">
          <div className="flex min-h-[calc(100vh-1.5rem)] flex-col gap-4 xl:flex-row">
            <Sidebar
              activeItem={activeNavItem}
              onSelect={scrollToSection}
              onToggleTheme={handleToggleTheme}
              onAddTransaction={openCreateModal}
              onResetFilters={resetFilters}
              canResetFilters={hasActiveFilters}
              role={state.role}
            />

            <main
              className={`flex-1 rounded-2xl border border-[var(--shell-border)] bg-[var(--bg-secondary)] p-4 transition-colors duration-500 sm:p-5 ${
                showIntro ? "dashboard-main-hidden" : "dashboard-main-ready"
              }`}
            >
              {isLoading ? (
                <LoadingDashboard />
              ) : (
                <div className="grid gap-4">
                  <Header
                    appName={appName}
                    latestTransactionDate={latestTransactionDate}
                    role={state.role}
                    theme={state.theme}
                    search={state.filters.search}
                    onSearchChange={(search) => setFilters({ search })}
                    onRoleChange={setRole}
                    onToggleTheme={handleToggleTheme}
                    onAddTransaction={openCreateModal}
                  />

                  <section ref={overviewRef} className="grid scroll-mt-24 gap-4 md:grid-cols-3">
                    <SummaryCard
                      title="Total balance"
                      value={summary.balance}
                      subtitle="Net position across active view"
                      tone="blue"
                      change={summaryChanges.balance}
                      theme={state.theme}
                      isActive={selectedMetric === "balance"}
                      onClick={() => handleSummaryCardClick("balance")}
                    />
                    <SummaryCard
                      title="Income"
                      value={summary.income}
                      subtitle="Cash inflow across salary and side income"
                      tone="green"
                      change={summaryChanges.income}
                      theme={state.theme}
                      isActive={selectedMetric === "income"}
                      onClick={() => handleSummaryCardClick("income")}
                    />
                    <SummaryCard
                      title="Expenses"
                      value={summary.expenses}
                      subtitle="Outflow across lifestyle and essentials"
                      tone="red"
                      change={summaryChanges.expenses}
                      theme={state.theme}
                      isActive={selectedMetric === "expenses"}
                      onClick={() => handleSummaryCardClick("expenses")}
                    />
                  </section>

                  <section className="soft-panel flex flex-col gap-3 rounded-[24px] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                        Focused view
                      </p>
                      <p className="mt-1 text-sm text-[var(--text-main)]">
                        {selectedMetric === "balance"
                          ? "Balance view keeps the full cash position visible in the revenue section."
                          : selectedMetric === "income"
                            ? "Income drilldown filters the table to inflows so you can review earning activity."
                            : "Expense drilldown filters the table to outflows for a cleaner spending review."}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {selectedCalendarDate ? (
                        <span className="rounded-full border border-[var(--border)] bg-[var(--card-soft)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-main)]">
                          Date filter: {selectedCalendarDate}
                        </span>
                      ) : null}
                      <button
                        type="button"
                        onClick={handleClearDrilldowns}
                        className="secondary-button"
                      >
                        Clear drilldowns
                      </button>
                    </div>
                  </section>

                  <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
                    {metricHighlights.map((item) => (
                      <article key={item.label} className="soft-panel rounded-[24px] p-4">
                        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--text-muted)]">
                          {item.label}
                        </p>
                        <p className="mt-4 text-[1.9rem] font-black leading-none text-[var(--text-main)]">
                          {item.value}
                        </p>
                        <p className="mt-3 text-sm text-[var(--text-muted)]">{item.detail}</p>
                      </article>
                    ))}
                  </section>

                  <section className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr),minmax(0,1fr)] xl:items-stretch">
                    <div ref={revenueRef} className="scroll-mt-24">
                      <TrendChart
                        data={chartSeries}
                        summary={summary}
                        chartWindow={chartWindow}
                        onChartWindowChange={setChartWindow}
                        onOpenControls={() => scrollToSection("transactions")}
                      />
                    </div>
                    <div ref={spendingRef} className="scroll-mt-24">
                      <CategoryChart
                        data={categoryBreakdown}
                        transactions={spendingTransactions}
                        spendingWindow={spendingWindow}
                        onWindowChange={handleChangeSpendingWindow}
                      />
                    </div>
                  </section>

                  <section className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr),minmax(0,0.92fr)] xl:items-stretch">
                    <BalanceBars data={monthlySeries.slice(-8)} />
                    <div ref={insightsRef} className="scroll-mt-24">
                      <InsightsPanel insights={insights} summary={summary} />
                    </div>
                  </section>

                  <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr),minmax(0,0.9fr)] xl:items-stretch">
                    <div ref={calendarRef} className="scroll-mt-24">
                      <CalendarPanel
                        transactions={filteredTransactions}
                        summary={summary}
                        visibleMonth={calendarMonth}
                        selectedDate={selectedCalendarDate}
                        onPreviousMonth={() => shiftCalendarMonth(-1)}
                        onNextMonth={() => shiftCalendarMonth(1)}
                        onSelectDate={handleSelectCalendarDate}
                      />
                    </div>
                    <InvoicesPanel
                      transactions={invoiceTransactions}
                      onCreateInvoice={openCreateModal}
                    />
                  </section>

                  <section ref={transactionsRef} className="grid scroll-mt-24 gap-4">
                    <FiltersBar
                      filters={state.filters}
                      categories={categories}
                      categoryGroups={categoryGroups}
                      hasActiveFilters={hasActiveFilters}
                      onChange={setFilters}
                      onReset={resetFilters}
                    />
                  </section>

                  <section className="grid gap-4">
                    <TransactionTable
                      transactions={filteredTransactions}
                      role={state.role}
                      groupBy={state.filters.groupBy}
                      onEdit={openEditModal}
                      onDelete={handleDeleteTransaction}
                      onClearFilters={resetFilters}
                      onExportCsv={handleExportCsv}
                      onExportJson={handleExportJson}
                    />
                  </section>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        role={state.role}
        transaction={editingTransaction}
        onClose={closeModal}
        onSubmit={handleSubmitTransaction}
        onDelete={handleDeleteTransaction}
      />
    </div>
  );
}
