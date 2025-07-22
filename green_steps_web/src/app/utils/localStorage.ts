export const saveActivityToLocalStorage = (activity: any) => {
    const logs = JSON.parse(localStorage.getItem("eco-logs") || "[]");
    const today = new Date().toISOString().split("T")[0];
  
    const existing = logs.find((log: any) => log.date === today);
  
    if (existing) {
      // Aggregate today's values
      existing.transport = (existing.transport || 0) + (activity.transport || 0);
      existing.energy = (existing.energy || 0) + (activity.energy || 0);
      existing.diet = (existing.diet || 0) + (activity.diet || 0);
      existing.co2 = (existing.co2 || 0) + (activity.co2 || 0);
    } else {
      logs.push({ ...activity, date: today });
    }
  
    localStorage.setItem("eco-logs", JSON.stringify(logs));
  };
  
  export const getActivityLogs = () => {
    return JSON.parse(localStorage.getItem("eco-logs") || "[]");
  };
  