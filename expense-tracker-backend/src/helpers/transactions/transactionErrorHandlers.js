
export const handleTransactionError = (error, res) => {
  console.error('Transaction operation error:', error);
  
  if (error.message === 'Transaction not found') {
    return res.status(404).json({ error: "Transaction not found" });
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
