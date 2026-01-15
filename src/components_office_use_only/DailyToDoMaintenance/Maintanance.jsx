import DailyTodoTable from "../CommonDailyTodo/DailyToDoTable";
import { useMaintenanceData, useUpdateMaintenanceRow } from "./services";


export default function Maintenance() {
  return (
    <DailyTodoTable 
      title="DailyTodo – Maintenance"
      sheetName="DailyToDo"
      useFetchHook={useMaintenanceData}
      useUpdateHook={useUpdateMaintenanceRow}
    />
  );
}