import React from 'react';

const page404 = React.lazy(() => import('./views/pages/page404/Page404'))

// const Toaster = React.lazy(() => import('./views/notifications/toaster/Toaster'));
// const Tables = React.lazy(() => import('./views/base/tables/Tables'));

// const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'));
// const Cards = React.lazy(() => import('./views/base/cards/Cards'));
// const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'));
// const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'));
// const BasicForms = React.lazy(() => import('./views/base/forms/BasicForms'));

// const Jumbotrons = React.lazy(() => import('./views/base/jumbotrons/Jumbotrons'));
// const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'));
// const Navbars = React.lazy(() => import('./views/base/navbars/Navbars'));
// const Navs = React.lazy(() => import('./views/base/navs/Navs'));
// const Paginations = React.lazy(() => import('./views/base/paginations/Pagnations'));
// const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'));
// const ProgressBar = React.lazy(() => import('./views/base/progress-bar/ProgressBar'));
// const Switches = React.lazy(() => import('./views/base/switches/Switches'));

// const Tabs = React.lazy(() => import('./views/base/tabs/Tabs'));
// const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'));
// const BrandButtons = React.lazy(() => import('./views/buttons/brand-buttons/BrandButtons'));
// const ButtonDropdowns = React.lazy(() => import('./views/buttons/button-dropdowns/ButtonDropdowns'));
// const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'));
// const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'));
// const Charts = React.lazy(() => import('./views/charts/Charts'));
// const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
// const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'));
// const Flags = React.lazy(() => import('./views/icons/flags/Flags'));
// const Brands = React.lazy(() => import('./views/icons/brands/Brands'));
// const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'));
// const Badges = React.lazy(() => import('./views/notifications/badges/Badges'));
// const Modals = React.lazy(() => import('./views/notifications/modals/Modals'));
// const Colors = React.lazy(() => import('./views/theme/colors/Colors'));
// const Typography = React.lazy(() => import('./views/theme/typography/Typography'));
// const Widgets = React.lazy(() => import('./views/widgets/Widgets'));
const Users = React.lazy(() => import('./views/users/Users'));
const User = React.lazy(() => import('./views/users/User'));

const MainForm = React.lazy(()=> import('./views/management/index/MainForm'))
const Home = React.lazy(() => import('./views/management/home/edit/Home-edit'))
const Villager = React.lazy(() => import('./views/management/villager/home-info/Villager-home-info'))
const VillagerEdit = React.lazy(() => import('./views/management/villager/edit/Villager-edit'))
const AnnouceMain = React.lazy(()=>import('./views/management/announce/management/main/Annouce-main'))
const AnnounceHistory = React.lazy(()=>import('./views/management/announce/history/main/Announce-history-main'))
const EstampMain = React.lazy(()=>import('./views/management/estamp/estamp/main/EstampMain'))
const EstampHomeChange = React.lazy(()=>import('./views/management/estamp/้home-change/main/Estamp-home-change'))
const EstampHistoryMain = React.lazy(()=>import('./views/management/estamp/history/main/Estamp-history-main'))
const ComplaintNotApproveMain = React.lazy(()=>import('./views/management/complaint/not-approve/main/Complaint-not-approve-main'))
const ComplaintRecieptMain = React.lazy(()=>import('./views/management/complaint/reciept/main/Complaint-reciept-main'))
const ComplaintSuccessMain = React.lazy(()=>import('./views/management/complaint/success/main/Complaint-success-main'))
const ParcelReceiveMain = React.lazy(()=>import('./views/management/parcel/main/main/Parcel-receive-main'))
const ParcelHistoryMain = React.lazy(()=>import('./views/management/parcel/history/main/Parcel-history-main'))
const UserProfileMain = React.lazy(()=>import('./views/management/profile/main/UserProfile-main'))
const SosMainInfo = React.lazy(()=>import('./views/management/sos/main/info/Sos-main-info'))
const SosHistoryInfo = React.lazy(()=>import('./views/management/sos/history/info/Sos-history-info'))
const ParcelChangeSendMain = React.lazy(()=>import('./views/management/parcel/change-send/main/Parcel-change-send-main'))
const routes = [
  { path: '/main', exact: true, name: 'Home',component:MainForm },
  { path: '/page404', name: 'Not Found', component: page404 },
  // { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  // { path: '/theme', name: 'Theme', component: Colors, exact: true },
  // { path: '/theme/colors', name: 'Colors', component: Colors },
  // { path: '/theme/typography', name: 'Typography', component: Typography },
  // { path: '/base', name: 'Base', component: Cards, exact: true },
  // { path: '/base/breadcrumbs', name: 'Breadcrumbs', component: Breadcrumbs },
  // { path: '/base/cards', name: 'Cards', component: Cards },
  // { path: '/base/carousels', name: 'Carousel', component: Carousels },
  // { path: '/base/collapses', name: 'Collapse', component: Collapses },
  // { path: '/base/forms', name: 'Forms', component: BasicForms },
  // { path: '/base/jumbotrons', name: 'Jumbotrons', component: Jumbotrons },
  // { path: '/base/list-groups', name: 'List Groups', component: ListGroups },
  // { path: '/base/navbars', name: 'Navbars', component: Navbars },
  // { path: '/base/navs', name: 'Navs', component: Navs },
  // { path: '/base/paginations', name: 'Paginations', component: Paginations },
  // { path: '/base/popovers', name: 'Popovers', component: Popovers },
  // { path: '/base/progress-bar', name: 'Progress Bar', component: ProgressBar },
  // { path: '/base/switches', name: 'Switches', component: Switches },
  // { path: '/base/tables', name: 'Tables', component: Tables },
  // { path: '/base/tabs', name: 'Tabs', component: Tabs },
  // { path: '/base/tooltips', name: 'Tooltips', component: Tooltips },
  // { path: '/buttons', name: 'Buttons', component: Buttons, exact: true },
  // { path: '/buttons/buttons', name: 'Buttons', component: Buttons },
  // { path: '/buttons/button-dropdowns', name: 'Dropdowns', component: ButtonDropdowns },
  // { path: '/buttons/button-groups', name: 'Button Groups', component: ButtonGroups },
  // { path: '/buttons/brand-buttons', name: 'Brand Buttons', component: BrandButtons },
  // { path: '/charts', name: 'Charts', component: Charts },
  // { path: '/icons', exact: true, name: 'Icons', component: CoreUIIcons },
  // { path: '/icons/coreui-icons', name: 'CoreUI Icons', component: CoreUIIcons },
  // { path: '/icons/flags', name: 'Flags', component: Flags },
  // { path: '/icons/brands', name: 'Brands', component: Brands },
  // { path: '/notifications', name: 'Notifications', component: Alerts, exact: true },
  // { path: '/notifications/alerts', name: 'Alerts', component: Alerts },
  // { path: '/notifications/badges', name: 'Badges', component: Badges },
  // { path: '/notifications/modals', name: 'Modals', component: Modals },
  // { path: '/notifications/toaster', name: 'Toaster', component: Toaster },
  // { path: '/widgets', name: 'Widgets', component: Widgets },
  { path: '/users', exact: true, name: 'Users', component: Users },
  { path: '/users/:id', exact: true, name: 'User Details', component: User },
  { path: '/home', exact: true, name: 'Home', component: Home },
  { path: '/villager', exact: true, name: 'Villager', component: Villager },
  { path: '/villager/edit', exact: true, name: 'Villager Edit', component: VillagerEdit },
  { path: '/annouce', exact: true, name: 'Annouce', component: AnnouceMain },
  { path: '/annouce-history', exact: true, name: 'Annouce History', component: AnnounceHistory },
  { path: '/estamp', exact: true, name: 'Estamp', component: EstampMain },
  { path: '/estamp-home-change', exact: true, name: 'Estamp Home Change', component: EstampHomeChange },
  { path: '/estamp-history', exact: true, name: 'Estamp History', component: EstampHistoryMain },
  { path: '/complaint-not-apprive', exact: true, name: 'Complaint Not Approve', component: ComplaintNotApproveMain },
  { path: '/complaint-receipt', exact: true, name: 'Complaint Receipt', component: ComplaintRecieptMain },
  { path: '/complaint-success', exact: true, name: 'Complaint Success', component: ComplaintSuccessMain },
  { path: '/parcel', exact: true, name: 'Parcel', component: ParcelReceiveMain },
  { path: '/parcel-history', exact: true, name: 'Parcel History', component: ParcelHistoryMain },
  { path: '/parcel-change', exact: true, name: 'Parcel Send Change', component: ParcelChangeSendMain }, 
  { path: '/user-profile', exact: true, name: 'User Profile', component: UserProfileMain }, 
  { path: '/sos', exact: true, name: 'Sos', component: SosMainInfo }, 
  { path: '/sos-history', exact: true, name: 'Sos History', component: SosHistoryInfo }, 
  
];

export default routes;
