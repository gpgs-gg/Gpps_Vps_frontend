import DailyTodoTable from "../CommonDailyTodo/DailyToDoTable";
import {
  useMaintenanceData,
  useUpdateMaintenanceCell,
} from "./services/index";

export default function Maintenance() {
  return (
    <DailyTodoTable
      title="DailyTodo – Maintenance"
      sheetName="DailyToDo"
      useFetchHook={useMaintenanceData}
      useUpdateHook={useUpdateMaintenanceCell}
    />
  ); 
}