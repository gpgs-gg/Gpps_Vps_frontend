import DailyTodoTable from "../CommonDailyTodo/DailyToDoTable";
import {
  useHouseKeepingData,
  useUpdateHouseKeepingRow,
} from "../DailyToDoHouseKeeping/services/index";

export default function HousekeepingPage() {
  return (
    <DailyTodoTable
      title="DailyTodo – Housekeeping"
      sheetName="DailyToDo"
      useFetchHook={useHouseKeepingData}
      useUpdateHook={useUpdateHouseKeepingRow}
    />
  );
}