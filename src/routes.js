import { createRouter, createWebHistory } from 'vue-router'


import About from './components/About'
import Home from './components/Home'
import AccountsList from './components/AccountsList'
import AssetsReport from './components/AssetsReport'
import BanksList from './components/BanksList'
import ConceptsCatalog from './components/ConceptsCatalog'
import Currencies from './components/Currencies'
import ChartEvolutionAssets from './components/ChartEvolutionAssets'
import InvestmentsList from './components/InvestmentsList'
import MaintenanceQuotes from './components/MaintenanceQuotes'
import OrdersList from './components/OrdersList'
import ProductsComparationList from './components/ProductsComparationList'
import ProductsRanges from './components/ProductsRanges'
import ProductsSearch from './components/ProductsSearch'
import ProductsUpdate from './components/ProductsUpdate'
import MaintenanceCatalogsUpdate from './components/MaintenanceCatalogsUpdate'
import ReportsAnnual from './components/ReportsAnnual'
import ReportsConcepts from './components/ReportsConcepts'
import ReportsDerivatives from './components/ReportsDerivatives'
import ReportsDividends from './components/ReportsDividends'
import ReportsEvolution from './components/ReportsEvolution'
import ReportsInvestmentsClasses from './components/ReportsInvestmentsClasses'
import ReportscurrentInvestmentsOperations from './components/ReportsCurrentInvestmentsOperations'
import ReportsInvestmentsLastOperation from './components/ReportsInvestmentsLastOperation'
import ReportsRanking from './components/ReportsRanking'
import ReportsZeroRisk from './components/ReportsZeroRisk.vue'
import Settings from './components/Settings'
import Statistics from './components/Statistics'
import StrategiesList from './components/StrategiesList'
import WidgetsMyDatePicker from './components/WidgetsMyDatePicker'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: `${import.meta.env.BASE_URL}/`, redirect: `${import.meta.env.BASE_URL}/about/` }, 
    { path: `${import.meta.env.BASE_URL}/about/`, name: 'about', component: About },
    { path: `${import.meta.env.BASE_URL}/home/`, name: 'home', component: Home },
    { path: `${import.meta.env.BASE_URL}/accounts/list/`, name: 'accounts_list', component: AccountsList },
    { path: `${import.meta.env.BASE_URL}/assets/report/`, name: 'assetsreport', component: AssetsReport },
    { path: `${import.meta.env.BASE_URL}/banks/list/`, name: 'banks_list', component: BanksList },
    { path: `${import.meta.env.BASE_URL}/concepts/catalog/`, name: 'concepts_catalog', component: ConceptsCatalog },
    { path: `${import.meta.env.BASE_URL}/currencies/`, name: 'currencies', component: Currencies },
    { path: `${import.meta.env.BASE_URL}/investments/list/`, name: 'investments_list', component: InvestmentsList },
    { path: `${import.meta.env.BASE_URL}/orders/list/`, name: 'orders_list', component: OrdersList },
    { path: `${import.meta.env.BASE_URL}/maintenance/quotes/`, name: 'maintenance_quotes', component: MaintenanceQuotes },
    { path: `${import.meta.env.BASE_URL}/products/ranges/`, name: 'products_ranges', component: ProductsRanges },
    { path: `${import.meta.env.BASE_URL}/products/comparation/list/`, name: 'products_comparation_list', component: ProductsComparationList },
    { path: `${import.meta.env.BASE_URL}/products/search/`, name: 'products_search', component: ProductsSearch },
    { path: `${import.meta.env.BASE_URL}/products/catalog/update/`, name: 'products_catalog_update', component: MaintenanceCatalogsUpdate },
    { path: `${import.meta.env.BASE_URL}/products/update/`, name: 'products_update', component: ProductsUpdate },
    { path: `${import.meta.env.BASE_URL}/reports/annual/`, name: 'reports_annual', component: ReportsAnnual },
    { path: `${import.meta.env.BASE_URL}/reports/concepts/`, name: 'reports_concepts', component: ReportsConcepts },
    { path: `${import.meta.env.BASE_URL}/reports/derivatives/`, name: 'reports_derivatives', component: ReportsDerivatives },
    { path: `${import.meta.env.BASE_URL}/reports/dividens/`, name: 'reports_dividends', component: ReportsDividends },
    { path: `${import.meta.env.BASE_URL}/reports/investmentsclasses/`, name: 'reports_investments_classes', component: ReportsInvestmentsClasses },
    { path: `${import.meta.env.BASE_URL}/reports/investments/lastoperation/`, name: 'reports_lastoperation', component: ReportsInvestmentsLastOperation },
    { path: `${import.meta.env.BASE_URL}/reports/investmentsoperations/current/`, name: 'reports_investmentsoperations_current', component: ReportscurrentInvestmentsOperations },
    { path: `${import.meta.env.BASE_URL}/reports/ranking/`, name: 'reports_ranking', component: ReportsRanking },
    { path: `${import.meta.env.BASE_URL}/reports/evolution/`, name: 'reports_evolution', component: ReportsEvolution },
    { path: `${import.meta.env.BASE_URL}/reports/zerorisk/`, name: 'reports_zero_risk', component: ReportsZeroRisk },
    { path: `${import.meta.env.BASE_URL}/reports/evolution/chart/`, name: 'reports_evolution_chart', component: ChartEvolutionAssets },
    { path: `${import.meta.env.BASE_URL}/settings/`, name: 'settings', component: Settings },
    { path: `${import.meta.env.BASE_URL}/statistics/`, name: 'statistics', component: Statistics },
    { path: `${import.meta.env.BASE_URL}/strategies/list/`, name: 'strategies_list', component: StrategiesList },
    { path: `${import.meta.env.BASE_URL}/widgets/mydatepicker/`, name: 'widgets_mydate_picker', component: WidgetsMyDatePicker },
  ]
})
