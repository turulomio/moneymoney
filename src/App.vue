<template>
    <v-app>    
        <v-navigation-drawer v-model="drawer" absolute temporary app class="blue-grey lighten-5 " style="position:fixed; top:0; left:0" width="350">
            <v-card class="mx-auto" >
                <v-list>
                    <v-list-item>
                            <v-list-item-title class="title" >Money Money<div  data-test="OpenWidgets" @click="open_widgets"></div></v-list-item-title>
                            <v-list-item-subtitle>{{ useStore().version }} ({{ useStore().versiondate.toISOString().slice(0,10)}})</v-list-item-subtitle>
                            <v-list-item-subtitle class="boldred" v-if="useStore().catalog_manager"><span class="vuered">{{ $t("With catalog manager role") }}</span></v-list-item-subtitle>
                    </v-list-item>


                    <v-divider></v-divider>

<!--                     BANKS -->
                    <v-list-item data-test="LateralBanks" link router :to="{ name: 'banks_list'}" v-if="useStore().logged" prepend-icon="mdi-bank" :title="$t('Banks')" />
<!--                     ACCOUNTS -->
                    <v-list-item data-test="LateralAccounts" link router :to="{ name: 'accounts_list'}" v-if="useStore().logged" prepend-icon="mdi-calculator" :title="$t('Accounts')" />
<!--                     INVESTMENTS -->
                    <v-list-item data-test="LateralInvestments" link router :to="{ name: 'investments_list'}" v-if="useStore().logged" prepend-icon="mdi-finance" :title="$t('Investments')" />
<!--                     ORDERS -->
                    <v-list-item link router :to="{ name: 'orders_list'}" v-if="useStore().logged" prepend-icon="mdi-cart" :title="$t('Orders')" />

<!--                     PRODUCTS -->
                    <v-list-group data-test="LateralProducts" value="Products" v-if="useStore().logged">
                        <template v-slot:activator="{ props }">
                            <v-list-item v-bind="props" prepend-icon="mdi-account-circle" :title="$t('Products')"></v-list-item>
                        </template>
                        <v-list-item data-test="LateralProductsUpdate" link router :to="{ name: 'products_update'}" :title="$t('Update')" />
                        <v-list-item data-test="LateralProductsSearch" link router :to="{ name: 'products_search'}" :title="$t('Search')" />
                        <v-list-item data-test="LateralProductsComparationList" link router :to="{ name: 'products_comparation_list'}" :title="$t('Comparation')" />
                    </v-list-group>        
            
<!--                     REPORTS -->
                    <v-list-group data-test="LateralReports" value="Reports" v-if="useStore().logged">

                        <template v-slot:activator="{ props }">
                            <v-list-item v-bind="props" prepend-icon="mdi-file-chart-outline" :title="$t('Reports')"></v-list-item>
                        </template>
                        
                        <v-list-item data-test="LateralReportsAnnual" link router :to="{ name: 'reports_annual'}">
                            <v-list-item-title>{{ $t("Annual") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item data-test="LateralReportsEvolution" link router :to="{ name: 'reports_evolution'}">
                            <v-list-item-title>{{ $t("Evolution") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item data-test="LateralReportsEvolutionChart" link router :to="{ name: 'reports_evolution_chart'}">
                            <v-list-item-title>{{ $t("Evolution chart") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item data-test="LateralReportsConcepts" link router :to="{ name: 'reports_concepts'}">
                            <v-list-item-title>{{ $t("Concepts") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item data-test="LateralReportsDerivatives" link router :to="{ name: 'reports_derivatives'}">
                            <v-list-item-title>{{ $t("Derivatives") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item data-test="LateralReportsRanking" link router :to="{ name: 'reports_ranking'}">
                            <v-list-item-title>{{ $t("Ranking") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item data-test="LateralReportsInvestmentsOperationsCurrent" link router :to="{ name: 'reports_investmentsoperations_current'}">
                            <v-list-item-title>{{ $t("Current investments operations") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item data-test="LateralReportsLastOperation" link router :to="{ name: 'reports_lastoperation'}">
                            <v-list-item-title>{{ $t("Investments last operation") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item data-test="LateralReportsAnnualRevaluation" link router :to="{ name: 'reports_annualrevaluation'}">
                            <v-list-item-title>{{ $t("Annual revaluation") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item data-test="LateralProductsRanges" link router :to="{ name: 'products_ranges'}">
                            <v-list-item-title>{{ $t("Product ranges") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item data-test="LateralReportsDividends" link router :to="{ name: 'reports_dividends'}">
                            <v-list-item-title>{{ $t("Dividends") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item data-test="LateralReportsInvestmentsClasses" link router :to="{ name: 'reports_investments_classes'}">
                            <v-list-item-title>{{ $t("Investments classes") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item data-test="LateralReportsZeroRisk" link router :to="{ name: 'reports_zero_risk'}">
                            <v-list-item-title>{{ $t("Zero risk investments") }}</v-list-item-title>
                        </v-list-item>
                    </v-list-group>
            
<!--                     STRATEGIES -->
                    <v-list-item  data-test="LateralStrategies" link router :to="{ name: 'strategies_list'}" v-if="useStore().logged" prepend-icon="mdi-strategy" :title="$t('Strategies')" />

<!--                     ADMINISTRATION -->
                    <v-list-group data-test="LateralAdministration" value="Administration" v-if="useStore().logged">
                        <template v-slot:activator="{ props }">
                            <v-list-item v-bind="props" prepend-icon="mdi-file-chart-outline" :title="$t('Administration')"></v-list-item>
                        </template>

                        <v-list-item  data-test="LateralProductsCatalogUpdate" link router :to="{ name: 'products_catalog_update'}">
                            <v-list-item-title>{{ $t("Products catalog update") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item data-test="LateralConceptsCatalog" link router :to="{ name: 'concepts_catalog'}">
                            <v-list-item-title data-test="lateral_concepts_catalog">{{ $t("Concepts catalog") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item  data-test="LateralMaintenanceQuotes" link router :to="{ name: 'maintenance_quotes'}">
                            <v-list-item-title>{{ $t("Quotes maintenance") }}</v-list-item-title>
                        </v-list-item>
                    </v-list-group>    

<!--                     HELP -->
                    <v-list-group data-test="LateralHelp" value="Help">
                        <template v-slot:activator="{ props }">
                            <v-list-item v-bind="props" prepend-icon="mdi-lifebuoy" :title="$t('Help')"></v-list-item>
                        </template>
                        <v-list-item  data-test="LateralAbout" link router :to="{ name: 'about'}" :title="$t('About')" />
                        <v-list-item data-test="LateralStatistics" link router :to="{ name: 'statistics'}" :title="$t('Statistics')" v-if="useStore().logged"/>
                        <v-list-item  href="https://github.com/turulomio/moneymoney/" target="_blank" :title="$t('Money Money project page')" />
                        <v-list-item  href="https://github.com/turulomio/django_moneymoney/" target="_blank" :title="$t('Django Money Money project page')" />
                    </v-list-group>     
                </v-list>
            </v-card>
        </v-navigation-drawer>
        
        <v-app-bar color="primary" dark  fixed fill-height app >
            <v-app-bar-nav-icon data-test="LateralIcon" @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-btn data-test="LateralHome" :to="{ name: 'home'}"><v-icon icon="mdi-home" dark></v-icon></v-btn>
            <v-btn data-test="LateralSettings" :to="{ name: 'settings'}" v-if="useStore().logged"><v-icon icon="mdi-wrench" dark></v-icon></v-btn> 
            <v-btn data-test="LateralAssetsReport" :to="{ name: 'assetsreport'}" v-if="useStore().logged"><v-icon icon="mdi-book" dark></v-icon></v-btn>
            <v-spacer />
            <h1 class="font-weight-black text-no-wrap text-truncate" >{{ $t("Money Money. Another way to manage your finances") }}</h1>
            <v-spacer />            
            <v-btn  data-test="LateralCurrrencies" :to="{ name: 'currencies'}" v-if="useStore().logged"><v-icon icon="mdi-currency-eur" dark></v-icon></v-btn>
            <BtnSwitchLanguages  data-test="LateralSwitchLanguages" />
            <BtnLogIn  data-test="LateralLogIn" v-show="!useStore().logged" class="mr-4"/>
            <BtnLogOut data-test="LateralLogOut" v-show="useStore().logged" class="mr-4"/>


        </v-app-bar>
        <v-main>   
            <router-view></router-view>
        </v-main>
    </v-app>
</template>

<script>
import { useStore } from "@/store"
import imgAccount from '@/assets/account.svg'
import imgInvestment from '@/assets/investment.svg'
import BtnLogIn from './components/BtnLogIn';
import BtnLogOut from './components/BtnLogOut';
import BtnSwitchLanguages from './components/BtnSwitchLanguages.vue';
export default {
    name: 'App',
    components: {
        BtnLogIn,
        BtnLogOut,
        BtnSwitchLanguages,
    },
    data () {
        return {
            logged:false,
            drawer: false,
            height:22,
            width:22,
            open_products:false,
            open_reports:false,
            imgAccount:imgAccount,
            imgInvestment:imgInvestment,
        }
    },
    methods:{
        useStore,
        open_widgets(){
            this.$router.push({name: "widgets"})
        }   
    },
};
</script>
<style >
h1   {
    text-align: center;
    font-weight: bold;
    padding-top: 6px;
}

h2 {
    text-align: center;
    font-weight: normal;
}

paragraph{
    text-align:justify;
    padding: 30px;
}

.v-card__title {
    margin-top: 0px;
    padding: 0px 0px 10px 0px;
}

span.vuered{
    color:red;
}

.cursorpointer {
    cursor: pointer;
}


.boldred{
    color: red;
    font-weight: 900;
}

.boldgreen{
    color: Green;
    font-weight: 900;
}

.bold{
    font-weight: 900;
}
.boldcenter{
    font-weight: 900;
    text-align: center;
}

.v-application .inform {
    margin-bottom: 1px;
    background-color: white !important;
}

.totalrow{
    background-color: whitesmoke;
    font-weight: 600;
}

.totalrow > td{
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 6px;
    padding-bottom: 6px;
}

</style>