import { formatMonthLabel } from "./formatters";

export function sortTransactions(transactions, sortBy) {
  const sorted = [...transactions];

  sorted.sort((left, right) => {
    if (sortBy === "date-asc") {
      return new Date(left.date) - new Date(right.date);
    }

    if (sortBy === "amount-desc") {
      return right.amount - left.amount;
    }

    if (sortBy === "amount-asc") {
      return left.amount - right.amount;
    }

    return new Date(right.date) - new Date(left.date);
  });

  return sorted;
}

export function filterTransactions(transactions, filters) {
  return transactions.filter((transaction) => {
    const search = filters.search.trim().toLowerCase();
    const matchesSearch =
      !search ||
      transaction.title.toLowerCase().includes(search) ||
      transaction.category.toLowerCase().includes(search) ||
      transaction.note.toLowerCase().includes(search);

    const matchesCategory =
      filters.category === "all" || transaction.category === filters.category;
    const matchesType = filters.type === "all" || transaction.type === filters.type;

    const transactionDate = new Date(transaction.date);
    const matchesStart =
      !filters.startDate || transactionDate >= new Date(filters.startDate);
    const matchesEnd = !filters.endDate || transactionDate <= new Date(filters.endDate);

    return matchesSearch && matchesCategory && matchesType && matchesStart && matchesEnd;
  });
}

export function getSummary(transactions) {
  let income = 0;
  let expenses = 0;

  for (const transaction of transactions) {
    if (transaction.type === "income") {
      income += transaction.amount;
    } else {
      expenses += transaction.amount;
    }
  }

  return {
    income,
    expenses,
    balance: income - expenses,
  };
}

export function getCategoryBreakdown(transactions) {
  const totals = {};

  for (const transaction of transactions) {
    if (transaction.type !== "expense") {
      continue;
    }

    totals[transaction.category] = (totals[transaction.category] || 0) + transaction.amount;
  }

  return Object.entries(totals)
    .map(([category, amount]) => ({ category, amount }))
    .sort((left, right) => right.amount - left.amount);
}

export function getMonthlySeries(transactions) {
  const grouped = {};

  for (const transaction of transactions) {
    const monthKey = transaction.date.slice(0, 7);
    if (!grouped[monthKey]) {
      grouped[monthKey] = {
        monthKey,
        label: formatMonthLabel(`${monthKey}-01`),
        income: 0,
        expenses: 0,
        net: 0,
        balance: 0,
      };
    }

    if (transaction.type === "income") {
      grouped[monthKey].income += transaction.amount;
    } else {
      grouped[monthKey].expenses += transaction.amount;
    }
  }

  const months = Object.values(grouped).sort((left, right) =>
    left.monthKey.localeCompare(right.monthKey),
  );

  let runningBalance = 0;
  for (const month of months) {
    month.net = month.income - month.expenses;
    runningBalance += month.net;
    month.balance = runningBalance;
  }

  return months;
}

export function getInsights(transactions) {
  const summary = getSummary(transactions);
  const categories = getCategoryBreakdown(transactions);
  const months = getMonthlySeries(transactions);
  const latestMonth = months[months.length - 1];
  const previousMonth = months[months.length - 2];
  const monthlyDelta =
    latestMonth && previousMonth
      ? ((latestMonth.net - previousMonth.net) / Math.max(Math.abs(previousMonth.net), 1)) * 100
      : 0;

  const averageTransaction =
    transactions.length === 0
      ? 0
      : transactions.reduce((total, transaction) => total + transaction.amount, 0) /
        transactions.length;

  const latestDate = transactions.length
    ? new Date(
        [...transactions]
          .sort((left, right) => new Date(right.date) - new Date(left.date))[0]
          .date,
      )
    : new Date("2026-04-05");
  const currentWeekStart = new Date(latestDate);
  currentWeekStart.setDate(latestDate.getDate() - 6);
  const previousWeekStart = new Date(currentWeekStart);
  previousWeekStart.setDate(currentWeekStart.getDate() - 7);
  const previousWeekEnd = new Date(currentWeekStart);
  previousWeekEnd.setDate(currentWeekStart.getDate() - 1);

  const foodThisWeek = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense" &&
        transaction.category === "Food" &&
        new Date(transaction.date) >= currentWeekStart &&
        new Date(transaction.date) <= latestDate,
    )
    .reduce((total, transaction) => total + transaction.amount, 0);

  const foodLastWeek = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense" &&
        transaction.category === "Food" &&
        new Date(transaction.date) >= previousWeekStart &&
        new Date(transaction.date) <= previousWeekEnd,
    )
    .reduce((total, transaction) => total + transaction.amount, 0);

  const foodWeeklyDelta = ((foodThisWeek - foodLastWeek) / Math.max(foodLastWeek, 1)) * 100;
  const incomeDelta =
    latestMonth && previousMonth
      ? ((latestMonth.income - previousMonth.income) / Math.max(previousMonth.income, 1)) * 100
      : 0;

  const smartInsights = [
    `You spent ${Math.abs(foodWeeklyDelta).toFixed(0)}% ${
      foodWeeklyDelta >= 0 ? "more" : "less"
    } on Food this week`,
    `Your income ${incomeDelta >= 0 ? "increased" : "decreased"} compared to last month`,
    `Highest spending category is ${categories[0]?.category || "not available"} right now`,
  ];

  return {
    topCategory: categories[0] || null,
    monthlyDelta,
    averageTransaction,
    savingsRate: summary.income === 0 ? 0 : (summary.balance / summary.income) * 100,
    latestMonthLabel: latestMonth?.label || "No recent month",
    smartInsights,
  };
}
