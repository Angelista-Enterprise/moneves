// Simple test script to verify transaction categorization
const testCategorization = async () => {
  try {
    // Test creating a budget category
    const budgetResponse = await fetch("http://localhost:3000/api/budgets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Test Category",
        monthlyLimit: 1000,
        icon: "💰",
        color: "text-blue-500",
        isTracked: true,
        isGoalLess: false,
      }),
    });

    if (!budgetResponse.ok) {
      throw new Error("Failed to create budget category");
    }

    const budget = await budgetResponse.json();
    console.log("✅ Budget category created:", budget);

    // Test categorizing a transaction
    const categorizeResponse = await fetch(
      "http://localhost:3000/api/transactions/categorize",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bunqTransactionId: "test-transaction-123",
          categoryId: budget.id,
        }),
      }
    );

    if (!categorizeResponse.ok) {
      throw new Error("Failed to categorize transaction");
    }

    const categorization = await categorizeResponse.json();
    console.log("✅ Transaction categorized:", categorization);

    // Test fetching categorization
    const fetchResponse = await fetch(
      `http://localhost:3000/api/transactions/categorize?bunqTransactionId=test-transaction-123`
    );

    if (!fetchResponse.ok) {
      throw new Error("Failed to fetch categorization");
    }

    const fetchedCategorization = await fetchResponse.json();
    console.log("✅ Categorization fetched:", fetchedCategorization);

    // Clean up - delete the budget
    const deleteResponse = await fetch(
      `http://localhost:3000/api/budgets/${budget.id}`,
      {
        method: "DELETE",
      }
    );

    if (!deleteResponse.ok) {
      throw new Error("Failed to delete budget");
    }

    console.log("✅ Budget deleted successfully");
    console.log("🎉 All tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
};

// Run the test
testCategorization();
