import PerfectScrollbar from 'react-perfect-scrollbar';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/themeConfigSlice';
import AnimateHeight from 'react-animate-height';
import { IRootState } from '../../store';
import { useState, useEffect } from 'react';
import IconCaretsDown from '../Icon/IconCaretsDown';
import IconCaretDown from '../Icon/IconCaretDown';
import IconMenuDashboard from '../Icon/Menu/IconMenuDashboard';
import IconMinus from '../Icon/IconMinus';
import IconMenuChat from '../Icon/Menu/IconMenuChat';
import IconMenuMailbox from '../Icon/Menu/IconMenuMailbox';
import IconMenuTodo from '../Icon/Menu/IconMenuTodo';
import IconMenuNotes from '../Icon/Menu/IconMenuNotes';
import IconMenuScrumboard from '../Icon/Menu/IconMenuScrumboard';
import IconMenuContacts from '../Icon/Menu/IconMenuContacts';
import IconMenuInvoice from '../Icon/Menu/IconMenuInvoice';
import IconMenuCalendar from '../Icon/Menu/IconMenuCalendar';
import IconMenuComponents from '../Icon/Menu/IconMenuComponents';
import IconMenuElements from '../Icon/Menu/IconMenuElements';
import IconMenuCharts from '../Icon/Menu/IconMenuCharts';
import IconMenuWidgets from '../Icon/Menu/IconMenuWidgets';
import IconMenuFontIcons from '../Icon/Menu/IconMenuFontIcons';
import IconMenuDragAndDrop from '../Icon/Menu/IconMenuDragAndDrop';
import IconMenuTables from '../Icon/Menu/IconMenuTables';
import IconMenuDatatables from '../Icon/Menu/IconMenuDatatables';
import IconMenuForms from '../Icon/Menu/IconMenuForms';
import IconMenuUsers from '../Icon/Menu/IconMenuUsers';
import IconMenuPages from '../Icon/Menu/IconMenuPages';
import IconMenuAuthentication from '../Icon/Menu/IconMenuAuthentication';
import IconMenuDocumentation from '../Icon/Menu/IconMenuDocumentation';

const Sidebar = () => {
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const [manageBannersMenu,setManageBannersMenu]=useState<string>('');

    const [manageCategoiesMenu,setManageCategories]=useState<string>('');
    const [productsMenu,setProductsMenu] = useState<string>('');
    const [manageOrdersMenu,setManageOrdersMenu]=useState<string>('');
    const [ManageTransactionMenu,setManageTransactionMenu]=useState<string>('');
    const [manageUsers,setManageUsersMenu]=useState<string>('');
    const [manageAdminsMenu,setManageAdminsMenu]=useState<string>('');

    
    
    const [errorSubMenu, setErrorSubMenu] = useState(false);
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const semidark = useSelector((state: IRootState) => state.themeConfig.semidark);
    const location = useLocation();
    const dispatch = useDispatch();

 const {userData}=useSelector((state:any)=>{
    return state.auth
 });
 if(userData===null){
    return ;
 }
    const { t } = useTranslation();
    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    const manageBannersToggleMenu= (value: string) => {
        setManageBannersMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    const manageCategoriesToggleMenu = (value: string) => {
        setManageCategories((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    const productToggleMenu= (value: string) => {
        setProductsMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };
    
    const ManageOrdersToggleMenu= (value: string) => {
        setManageOrdersMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };
    const ManageTransactionToggleMenu= (value: string) => {
       setManageTransactionMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };
    const manageUsersToggleMenu= (value: string) => {
        setManageUsersMenu((oldValue) => {
             return oldValue === value ? '' : value;
         });
     };



     const manageAdminsToggleMenu= (value: string) => {
        setManageAdminsMenu((oldValue) => {
             return oldValue === value ? '' : value;
         });
     };


    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav
                className={`sidebar fixed min-h-screen h-full top-0 bottom-0 w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] z-50 transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}
            >
                <div className="bg-white dark:bg-black h-full">
                    <div className="flex justify-between items-center px-4 py-3">
                        <NavLink to="/" className="main-logo flex items-center shrink-0">
                            <img className="w-8 ml-[5px] flex-none" src="/assets/images/logo.jpeg" alt="logo" style={{width:"30%",height:"30px"}}/>
                            <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5 font-semibold align-middle lg:inline dark:text-white-light">{t('Sunfo')}</span>
                        </NavLink>

                        <button
                            type="button"
                            className="collapse-icon w-8 h-8 rounded-full flex items-center hover:bg-gray-500/10 dark:hover:bg-dark-light/10 dark:text-white-light transition duration-300 rtl:rotate-180"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <IconCaretsDown className="m-auto rotate-90" />
                        </button>
                    </div>
                    <PerfectScrollbar className="h-[calc(100vh-80px)] relative">
                        <ul className="relative font-semibold space-y-0.5 p-4 py-0">
                            {/* <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'dashboard' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('dashboard')}>
                                    <div className="flex items-center">
                                        <IconMenuDashboard
                                         className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('dashboard')}</span>
                                    </div>

                                    <div className={currentMenu !== 'dashboard' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'dashboard' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <NavLink to="/">{t('Feature')}</NavLink>
                                        </li>
                                        {/* <li>
                                            <NavLink to="/analytics">{t('analytics')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/finance">{t('finance')}</NavLink>
                                        </li> */}
                                        {/* <li>
                                            <NavLink to="/dash-board">{t('Feature')}</NavLink>
                                        </li> */}
                                    {/* </ul> */}
                                {/* </AnimateHeight> */}
                            {/* </li>  */}




                            <li className="menu nav-item">
                                <NavLink to="/" className="group">
                                    <div className="flex items-center">
                                        <IconMenuCharts className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t(`Dashboard`)}</span>
                                    </div>
                                </NavLink>
                            </li>


                            <h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                                <IconMinus className="w-4 h-5 flex-none hidden" />
                                <span>{t('apps')}</span>
                            </h2>










                            <li className="menu nav-item">
                                <button type="button" className={`${manageBannersMenu === 'component' ? 'active' : ''} nav-link group w-full`} onClick={() => manageBannersToggleMenu('component')}>
                                    <div className="flex items-center">
                                        <IconMenuComponents className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Manage Banners')}</span>
                                    </div>

                                    <div className={manageBannersMenu!== 'component' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={manageBannersMenu=== 'component' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <NavLink to="/new-all-banners">{t('New All Banners')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/add-new-banner">{t('Add New Banner')}</NavLink>
                                        </li>
                                       
                                        
                                        
                                    </ul>
                                </AnimateHeight>
                            </li>





















                            
                            
                            <li className="menu nav-item">
                                <button type="button" className={`${manageCategoiesMenu === 'component' ? 'active' : ''} nav-link group w-full`} onClick={() => manageCategoriesToggleMenu('component')}>
                                    <div className="flex items-center">
                                        <IconMenuComponents className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Manage Categories')}</span>
                                    </div>

                                    <div className={manageCategoiesMenu!== 'component' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={manageCategoiesMenu === 'component' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <NavLink to="/view-categories">{t('View Categories')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/add-new-category">{t('Add New Category')}</NavLink>
                                        </li>
                                       
                                        
                                        
                                    </ul>
                                </AnimateHeight>
                            </li>
                            
                            
                            
                            
                            
                            
                            
                            
                            
                            
                            
                            
                            
                            
                            <li className="menu nav-item">
                                <button type="button" className={`${productsMenu === 'component' ? 'active' : ''} nav-link group w-full`} onClick={() => productToggleMenu('component')}>
                                    <div className="flex items-center">
                                        <IconMenuComponents className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Products')}</span>
                                    </div>

                                    <div className={productsMenu !== 'component' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={productsMenu === 'component' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <NavLink to="/manage-products">{t('Manage Products')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/add-product">{t('Add Products')}</NavLink>
                                        </li>
                                        
                                        
                                        
                                    </ul>
                                </AnimateHeight>
                            </li>








                            <li className="menu nav-item">
                                <button type="button" className={`${manageOrdersMenu=== 'component' ? 'active' : ''} nav-link group w-full`} onClick={() => ManageOrdersToggleMenu('component')}>
                                    <div className="flex items-center">
                                        <IconMenuComponents className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Manage Orders')}</span>
                                    </div>

                                    <div className={manageOrdersMenu!== 'component' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={manageOrdersMenu === 'component' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <NavLink to="/view-orders">{t('View Orders')}</NavLink>
                                        </li>
                                    
                                        
                                        
                                        
                                    </ul>
                                </AnimateHeight>
                            </li>















                                 <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'component' ? 'active' : ''} nav-link group w-full`} onClick={() => ManageTransactionToggleMenu('component')}>
                                    <div className="flex items-center">
                                        <IconMenuComponents className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Manage Transaction')}</span>
                                    </div>

                                    <div className={ManageTransactionMenu !== 'component' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={ManageTransactionMenu === 'component' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <NavLink to="/view-transcations">{t('View Transcations')}</NavLink>
                                        </li>
                                       
                                        
                                        
                                    </ul>
                                </AnimateHeight>
                            </li>






                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'component' ? 'active' : ''} nav-link group w-full`} onClick={() => manageUsersToggleMenu('component')}>
                                    <div className="flex items-center">
                                        <IconMenuComponents className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Manage Users /Reviews')}</span>
                                    </div>

                                    <div className={manageUsers !== 'component' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={manageUsers === 'component' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <NavLink to="/manage-reviews">{t('Manage Reviews')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/manage-subscribe-users">{t('Manage Subscribe Users')}</NavLink>
                                        </li>
                                       
                                        
                                        
                                    </ul>
                                </AnimateHeight>
                            </li>






{userData.role==="super-admin" &&


                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'component' ? 'active' : ''} nav-link group w-full`} onClick={() => manageAdminsToggleMenu('component')}>
                                    <div className="flex items-center">
                                        <IconMenuComponents className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('Manage Admins')}</span>
                                    </div>

                                    <div className={manageAdminsMenu !== 'component' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={manageAdminsMenu === 'component' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <NavLink to="/manage-admins">{t('Manage Admins')}</NavLink>
                                        </li>
                                        <li>
                                            <NavLink to="/add-admin">{t('Add Admin')}</NavLink>
                                        </li>
                                       
                                        
                                        
                                    </ul>
                                </AnimateHeight>
                            </li>
}
















                            <li className="nav-item">
                               
                            </li>

                            <h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                                <IconMinus className="w-4 h-5 flex-none hidden" />
                                <span>{t('user_interface')}</span>
                            </h2>

                           
                            

                            <li className="menu nav-item">
                                <NavLink to="/bulk-discount" className="group">
                                    <div className="flex items-center">
                                        <IconMenuCharts className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t(`Bulk Discount`)}</span>
                                    </div>
                                </NavLink>
                            </li>


                         

                         

                            

                            <h2 className="py-3 px-7 flex items-center uppercase font-extrabold bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] -mx-4 mb-1">
                                <IconMinus className="w-4 h-5 flex-none hidden" />
                                <span>{t('user_and_pages')}</span>
                            </h2> 

                            

                         

                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'auth' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('auth')}>
                                    <div className="flex items-center">
                                        <IconMenuAuthentication className="group-hover:!text-primary shrink-0" />
                                        <span className="ltr:pl-3 rtl:pr-3 text-black dark:text-[#506690] dark:group-hover:text-white-dark">{t('authentication')}</span>
                                    </div>

                                    <div className={currentMenu !== 'auth' ? 'rtl:rotate-90 -rotate-90' : ''}>
                                        <IconCaretDown />
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'auth' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <NavLink to="/login" target="_blank">
                                                {t('login')}
                                            </NavLink>
                                        </li>
                                       
                                    </ul>
                                </AnimateHeight>
                            </li>

                            
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
