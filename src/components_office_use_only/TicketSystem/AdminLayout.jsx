import { Dashboard } from './Dashboard';
import { TicketList } from './TicketList';
import { CreateEditTicket } from './CreateEditTicket';
import { TicketDetails } from './TicketDetails';
import { KanbanBoard } from './KanbanBoard';
import { Reports } from './Reports';
import { UserManagement } from './UserManagement';
import { Settings } from './Settings';
import Navigation from './Navigation';
import { useApp } from './AppProvider';
import PgPropertyDetails from './ClientActions/PgPropertyDetails';
import PersonalInfo from './ClientActions/PersonalInfo';
import Payments from './ClientActions/Payments';
import { MyPGTickets } from './ClientActions/MyPGTickets';
import Documents from './ClientActions/Documents';
import EBSheetDetails from '../EBCalculation/EBSheetDetails';

const AdminLayout = () => {
  const { currentView } = useApp();
  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'payments':
        return <Payments />;
      case 'personalinfo':
        return <PersonalInfo />;
      case 'documents':
        return <Documents />;
      case 'pgpropertydetails':
        return < PgPropertyDetails/>;
      case 'mypgtickets':
        return < MyPGTickets/>;
      case 'tickets':
        return <TicketList />;
      case 'create':
        return <CreateEditTicket />;
      case 'edit':
        return <CreateEditTicket isEdit={true} />;
      case 'details':
        return <TicketDetails />;
      case 'kanban':
        return <KanbanBoard />;
      case 'reports':
        return <Reports />;
      case 'users':
        return <UserManagement />;
      case 'EBInfo':
        return <EBSheetDetails />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <Navigation />
      <main className="main-content container mx-auto px-6 pb-0 ">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminLayout;
