export const handleBudgetError = (error, res) => {
  // Handle validation errors
  if (error.type === 'validation') {
    return res.status(400).json({ 
      error: error.message || "Validation failed", 
      details: error.details 
    });
  }
  
  // Handle missing required fields
  if (error.type === 'missing_field') {
    return res.status(400).json({ error: error.message });
  }
  
  // Handle duplicate budget errors
  if (error.message && error.message.includes('already exists')) {
    return res.status(409).json({ error: error.message });
  }
  
  // Handle DynamoDB conditional check failures (budget not found or access denied)
  if (error.name === 'ConditionalCheckFailedException') {
    return res.status(404).json({ error: 'Budget not found or access denied' });
  }
  
  // Handle standard errors
  if (error.message === 'Budget not found') {
    return res.status(404).json({ error: "Budget not found" });
  }
  
  if (error.message.startsWith('Unauthorized')) {
    return res.status(403).json({ error: error.message });
  }
  
  if (error.message === 'No fields to update') {
    return res.status(400).json({ error: "No fields to update" });
  }
  
  // Default case
  return res.status(500).json({ error: "Internal server error" });
};
