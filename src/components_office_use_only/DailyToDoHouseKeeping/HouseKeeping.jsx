import DailyTodoTable from "../CommonDailyTodo/DailyToDoTable";
import {
  useHouseKeepingData,
  useUpdateHouseKeepingCell,
} from "../DailyToDoHouseKeeping/services/index";

export default function HousekeepingPage() {
  return (
    <DailyTodoTable
      title="DailyTodo – Housekeeping"
      sheetName="DailyToDo"
      useFetchHook={useHouseKeepingData}
      useUpdateHook={useUpdateHouseKeepingCell}
    />
  );
}