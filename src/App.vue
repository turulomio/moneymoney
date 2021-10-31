<template>
    <v-app>    
        <v-navigation-drawer v-model="drawer" absolute temporary app class="blue-grey lighten-5 " style="position:fixed; top:0; left:0" width="350">
            <v-card class="mx-auto" >
                <v-list>
                
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title class="title">Money Money</v-list-item-title>
                            <v-list-item-subtitle>{{ $store.state.version }}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>

                    <v-divider></v-divider>

<!--                     BANKS -->
                    <v-list-item link router :to="{ name: 'banks_list'}" v-if="$store.state.logged">
                        <v-list-item-icon><v-icon color="#757575;">mdi-bank</v-icon></v-list-item-icon>
                        <v-list-item-title>{{ $t("Banks") }}</v-list-item-title>
                    </v-list-item>
<!--                     ACCOUNTS -->
                    <v-list-item link router :to="{ name: 'accounts_list'}"  v-if="$store.state.logged">
                        <v-list-item-icon><v-img color="#757575;" src="@/assets/account.svg"  :height="height" :width="width"></v-img></v-list-item-icon>
                        <v-list-item-title>{{ $t("Accounts") }}</v-list-item-title>
                    </v-list-item>
<!--                     INVESTMENTS -->
                    <v-list-item link router :to="{ name: 'investments_list'}" v-if="$store.state.logged">
                        <v-list-item-icon><v-img color="#757575;"  src="@/assets/investment.svg"  :height="height" :width="width"></v-img></v-list-item-icon>
                        <v-list-item-title>{{ $t("Investments") }}</v-list-item-title>
                    </v-list-item>
                            
<!--                     ORDERS -->
                    <v-list-item link router :to="{ name: 'orders_list'}" v-if="$store.state.logged">
                        <v-list-item-icon><v-icon color="#757575;">mdi-cart</v-icon></v-list-item-icon>
                        <v-list-item-title>{{ $t("Orders") }}</v-list-item-title>
                    </v-list-item>

<!--                     PRODUCTS -->
                    <v-list-group :value="false"  v-if="$store.state.logged">
                        <template #prependIcon>
                            <v-img color="#757575;" src="@/assets/product.svg" :height="height" :width="width"></v-img>
                        </template>
                        <template #activator>
                            {{ $t("Products")}}
                        </template>
                        <v-list-item link router :to="{ name: 'products_update'}">
                            <v-list-item-title>{{ $t("Update") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item link router :to="{ name: 'products_search'}">
                            <v-list-item-title>{{ $t("Search") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item link router :to="{ name: 'products_comparation_list'}">
                            <v-list-item-title>{{ $t("Comparation") }}</v-list-item-title>
                        </v-list-item>
                    </v-list-group>        
            
<!--                     REPORTS -->
                    <v-list-group :value="false" prepend-icon="mdi-file-chart-outline"  v-if="$store.state.logged">
                        <template v-slot:activator>
                            <v-list-item-title>{{ $t("Reports") }}</v-list-item-title>
                        </template>
                        <v-list-item link router :to="{ name: 'reports_annual'}">
                            <v-list-item-title>{{ $t("Annual") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item link router :to="{ name: 'reports_evolution'}">
                            <v-list-item-title>{{ $t("Evolution") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item link router :to="{ name: 'reports_evolution_chart'}">
                            <v-list-item-title>{{ $t("Evolution chart") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item link router :to="{ name: 'reports_concepts'}">
                            <v-list-item-title>{{ $t("Concepts") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item link router :to="{ name: 'reports_ranking'}">
                            <v-list-item-title>{{ $t("Ranking") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item link router :to="{ name: 'reports_investmentsoperations_current'}">
                            <v-list-item-title>{{ $t("Current investments operations") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item link router :to="{ name: 'reports_lastoperation'}">
                            <v-list-item-title>{{ $t("Investments last operation") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item link router :to="{ name: 'products_ranges'}">
                            <v-list-item-title>{{ $t("Product ranges") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item link router :to="{ name: 'reports_dividends'}">
                            <v-list-item-title>{{ $t("Dividends") }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item link router :to="{ name: 'reports_investments_classes'}">
                            <v-list-item-title>{{ $t("Investments classes") }}</v-list-item-title>
                        </v-list-item>
                    </v-list-group>
            
<!--                     STRATEGIES -->
                    <v-list-item link router :to="{ name: 'strategies_list'}" v-if="$store.state.logged">
                        <v-list-item-icon><v-icon color="#757575;">mdi-strategy</v-icon></v-list-item-icon>
                        <v-list-item-title>{{ $t("Strategies") }}</v-list-item-title>
                    </v-list-item>

<!--                     ADMINISTRATION -->
                    <v-list-group :value="false" prepend-icon="mdi-file-chart-outline"  v-if="$store.state.logged">
                        <template v-slot:activator>
                            <v-list-item-title>{{ $t("Administration") }}</v-list-item-title>
                        </template>
                        <v-list-item link router :to="{ name: 'concepts_catalog'}">
                            <v-list-item-title>{{ $t("Concepts catalog") }}</v-list-item-title>
                        </v-list-item>
                    </v-list-group>    

<!--                     HELP -->
                    <v-list-group :value="false" prepend-icon="mdi-lifebuoy">
                        <template v-slot:activator>
                            <v-list-item-title>{{ $t("Help") }}</v-list-item-title>
                        </template>
                      
                        <v-list-item link router :to="{ name: 'about'}">
                            <v-list-item-title>{{ $t("About")}}</v-list-item-title>
                        </v-list-item>

                        <v-list-item link router :to="{ name: 'statistics'}">
                            <v-list-item-title>{{ $t("Statistics")}}</v-list-item-title>
                        </v-list-item>

                        <v-list-item  href="https://github.com/turulomio/moneymoney/" target="_blank">
                            <v-list-item-title>{{ $t('Money Money Github') }}</v-list-item-title>
                        </v-list-item>
                        
                        <v-list-item href="https://github.com/turulomio/django_moneymoney/" target="_blank">
                            <v-list-item-title>{{ $t('Django Money Money Github') }}</v-list-item-title>
                        </v-list-item>
                    </v-list-group>
                </v-list>
            </v-card>
        </v-navigation-drawer>
        
        <v-app-bar color="primary" dark  fixed fill-height app >
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-btn color="primary" :to="{ name: 'home'}"><v-icon dark>mdi-home</v-icon></v-btn>
            <v-btn color="primary" :to="{ name: 'settings'}" v-if="$store.state.logged"><v-icon dark>mdi-wrench</v-icon></v-btn>
            <v-btn color="primary" :to="{ name: 'assetsreport'}" v-if="$store.state.logged"><v-icon dark>mdi-book</v-icon></v-btn>
            <v-spacer />
            <h1 class="font-weight-black text-no-wrap text-truncate" >{{ $t("Money Money. Another way to manage your finances") }}</h1>
            <v-spacer />
            <SwitchLanguages />
            <btnLogIn v-show="!this.$store.state.logged"/>
            <btnLogOut v-show="this.$store.state.logged"/>

        </v-app-bar>
        <v-main>   
            <router-view></router-view>
        </v-main>
    </v-app>
</template>

<script>
import btnLogIn from './components/btnLogIn';
import btnLogOut from './components/btnLogOut';
import SwitchLanguages from './components/SwitchLanguages.vue';
export default {
    name: 'App',
    components: {
        btnLogIn,
        btnLogOut,
        SwitchLanguages,
    },
    data () {
        return {
            logged:false,
            drawer: false,
            height:22,
            width:22,
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

span.vuered{
    color:red;
}


.boldred{
    color: red;
    font-weight: 900;
}
.boldgreen{
    color: Green;
    font-weight: 900;
}
.v-application .inform {
    margin-bottom: 1px;
    background-color: white !important;
}


/*SLIM MONTHPICKER*/
.v-date-picker-table--month td {
    height: unset;
}

.v-date-picker-table {
    height: unset;
}
</style>