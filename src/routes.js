import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from './store.js'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/home/' },
    { path: '/about/', name: 'about', component: () => import('./components/About.vue') },
    { path: '/home/', name: 'home', component: () => import('./components/Home.vue') },
    { path: '/accounts/list/', name: 'accounts_list', component: () => import('./components/AccountsList.vue') },
    { path: '/assets/report/', name: 'assetsreport', component: () => import('./components/AssetsReport.vue') },
    { path: '/banks/list/', name: 'banks_list', component: () => import('./components/BanksList.vue') },
    { path: '/concepts/catalog/', name: 'concepts_catalog', component: () => import('./components/ConceptsCatalog.vue') },
    { path: '/currencies/', name: 'currencies', component: () => import('./components/Currencies.vue') },
    { path: '/investments/list/', name: 'investments_list', component: () => import('./components/InvestmentsList.vue') },
    { path: '/orders/list/', name: 'orders_list', component: () => import('./components/OrdersList.vue') },
    { path: '/maintenance/quotes/', name: 'maintenance_quotes', component: () => import('./components/MaintenanceQuotes.vue') },
    { path: '/products/ranges/', name: 'products_ranges', component: () => import('./components/ProductsRanges.vue') },
    { path: '/products/comparation/list/', name: 'products_comparation_list', component: () => import('./components/ProductsComparationList.vue') },
    { path: '/products/search/', name: 'products_search', component: () => import('./components/ProductsSearch.vue') },
    { path: '/products/catalog/update/', name: 'products_catalog_update', component: () => import('./components/MaintenanceCatalogsUpdate.vue') },
    { path: '/products/update/', name: 'products_update', component: () => import('./components/ProductsUpdate.vue') },
    { path: '/reports/annual/', name: 'reports_annual', component: () => import('./components/ReportsAnnual.vue') },
    { path: '/reports/concepts/', name: 'reports_concepts', component: () => import('./components/ReportsConcepts.vue') },
    { path: '/reports/derivatives/', name: 'reports_derivatives', component: () => import('./components/ReportsDerivatives.vue') },
    { path: '/reports/dividens/', name: 'reports_dividends', component: () => import('./components/ReportsDividends.vue') },
    { path: '/reports/investmentsclasses/', name: 'reports_investments_classes', component: () => import('./components/ReportsInvestmentsClasses.vue') },
    { path: '/reports/investments/lastoperation/', name: 'reports_lastoperation', component: () => import('./components/ReportsInvestmentsLastOperation.vue') },
    { path: '/reports/annualrevaluation/', name: 'reports_annualrevaluation', component: () => import('./components/ReportsAnnualRevaluation.vue') },
    { path: '/reports/investmentsoperations/current/', name: 'reports_investmentsoperations_current', component: () => import('./components/ReportsCurrentInvestmentsOperations.vue') },
    { path: '/reports/ranking/', name: 'reports_ranking', component: () => import('./components/ReportsRanking.vue') },
    { path: '/reports/evolution/', name: 'reports_evolution', component: () => import('./components/ReportsEvolution.vue') },
    { path: '/reports/zerorisk/', name: 'reports_zero_risk', component: () => import('./components/ReportsZeroRisk.vue') },
    { path: '/reports/evolution/chart/', name: 'reports_evolution_chart', component: () => import('./components/ChartEvolutionAssets.vue') },
    { path: '/settings/', name: 'settings', component: () => import('./components/Settings.vue') },
    { path: '/statistics/', name: 'statistics', component: () => import('./components/Statistics.vue') },
    { path: '/strategies/list/', name: 'strategies_list', component: () => import('./components/StrategiesList.vue') },
    { path: '/widgets/', name: 'widgets', component: () => import('./components/Widgets.vue') },
    { path: '/widgets/chartpie/', name: 'widgets_chartpie', component: () => import('./components/WidgetsChartPie.vue') },
    { path: '/widgets/mydatepicker/', name: 'widgets_mydatepicker', component: () => import('./components/WidgetsMyDatePicker.vue') },
    { path: '/widgets/mydatetimepicker/', name: 'widgets_mydatetimepicker', component: () => import('./components/WidgetsMyDateTimePicker.vue') },
    { path: '/widgets/mymonthpicker/', name: 'widgets_mymonthpicker', component: () => import('./components/WidgetsMyMonthPicker.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/home/' }
  ]
})

router.beforeEach((to, from, next) => {
  const store = useStore()
  const publicRouteNames = ['home', 'about']

  if (!publicRouteNames.includes(to.name) && !store.logged) {
    return next({ name: 'home' })
  }

  next()
})
