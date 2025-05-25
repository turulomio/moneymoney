<template>
    <div>    
        <h1>{{ $t('Concepts catalog') }}
            <MyMenuInline :items="menuinline_items"></MyMenuInline>
        </h1>
        <v-data-table density="compact" :headers="investments_headers" :search="search" :items="concepts" :sort-by="[{key:'id',order:'asc'}]" class="elevation-1 ma-4" :loading="loading" :key="key"    :items-per-page="10000" >
            <template #item.editable="{item}">
                <v-icon small v-if="item.editable" >mdi-check-outline</v-icon>
            </template>             
            <template #item.operationstypes="{item}">
               <div v-html="this.useStore().operationstypes.get(item.operationstypes).localname"></div>
           </template>           
            <template #item.name="{item}">
               <div v-html="item.name" :class="(item.editable==true && item.id<1000) ? 'boldred' : ''"></div>
           </template>
            <template #item.balance_user="{item}">
                <div v-html="localcurrency_html(item.balance_user )"></div>
            </template>          
            <template #item.actions="{item}">
                <v-icon :data-test="`ConceptsCatalog_Table_ButtonUpdate${item.id}`" v-if="item.editable" small class="ml-1" @click.stop="editItem(item)">mdi-pencil</v-icon>
                <v-icon :data-test="`ConceptsCatalog_Table_ButtonDelete${item.id}`" v-if="item.editable && item.used==0" small class="ml-1" @click.stop="deleteItem(item)">mdi-delete</v-icon>
                <v-icon :data-test="`ConceptsCatalog_Table_ButtonMigrate${item.id}`" v-if="item.migrable" small class="ml-1" @click.stop="migrateConcept(item)" color="#9933ff" style="font-weight:bold">mdi-folder-move-outline</v-icon>     
            </template> 
            <template #bottom ></template>                  
        </v-data-table>
        <!-- DIALOG CONCEPTS ADD/UPDATE -->
        <v-dialog v-model="dialog_concepts_cu" max-width="550">
            <v-card class="pa-8">
                <ConceptsCU :concept="concept" :mode="concept_mode" :key="key" @cruded="on_ConceptsCU_cruded"></ConceptsCU>
            </v-card>
        </v-dialog>
        <!-- DIALOG CONCEPTS MIGRATION -->
        <v-dialog v-model="dialog_concepts_migration" max-width="550">
            <v-card class="pa-8">
                <ConceptsMigration :from="concept" :key="key" @cruded="on_ConceptsMigration_cruded"></ConceptsMigration>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import axios from 'axios'
    import { useStore } from "@/store"
    import MyMenuInline from './MyMenuInline.vue'
    import ConceptsCU from './ConceptsCU.vue'
    import ConceptsMigration from './ConceptsMigration.vue'
    import {empty_concept} from '../empty_objects.js'
import { parseResponseError } from '@/functions'
    export default {
        components:{
            MyMenuInline,
            ConceptsCU,
            ConceptsMigration,
        },
        data(){ 
            return{
                showActive:true,
                investments_headers: [
                    { title: this.$t('Id'), sortable: true, key: 'id',width:"3%"},
                    { title: this.$t('Editable'), key: 'editable',  width: "3%", align:'end'},
                    { title: this.$t('Name'), key: 'name'},
                    { title: this.$t('Operation type'), key: 'operationstypes'},
                    { title: this.$t('Used'), key: 'used'},
                    { title: this.$t('Actions'), key: 'actions', sortable: false , width: "10%"},
                ],
                concepts:[],
                menuinline_items: [
                    {
                        subheader: this.$t("Investment options"),
                        children: [
                            {
                                name: this.$t("Add a new concept"),
                                icon: "mdi-plus",
                                code: function(){
                                    this.concept=this.empty_concept()
                                    this.key=this.key+1
                                    this.concept_mode="C"
                                    this.dialog_concepts_cu=true
                                }.bind(this),
                            },
                        ]
                    },
                ],
                loading:false,
                search:"",

                key:0,

                //Dialog ConceptsCU
                dialog_concepts_cu:false,
                concept:null,
                concept_mode:null,

                //Dialog ConceptsMigration
                dialog_concepts_migration:false


            }
        },
        methods: {
            useStore,
            parseResponseError,
            deleteItem (item) {
                this.concept=item
                this.key=this.key+1
                this.concept_mode="D"
                this.dialog_concepts_cu=true
            },
            editItem (item) {
                this.concept=item
                this.key=this.key+1
                this.concept_mode="U"
                this.dialog_concepts_cu=true
             },
            migrateConcept(item){
                this.concept=item
                this.key=this.key+1
                this.dialog_concepts_migration=true
            },
            empty_concept,
            on_ConceptsCU_cruded(){
                this.dialog_concepts_cu=false
                this.update_table()
            },
            on_ConceptsMigration_cruded(){
                this.dialog_concepts_migration=false
                this.update_table()
            },
            update_table(){
                this.loading=true
                axios.get(`${this.useStore().apiroot}/api/concepts/used/`, this.myheaders())
                .then((response) => {
                    this.concepts=response.data
                    this.loading=false
                }, (error) => {
                    this.parseResponseError(error)
                });
            },
        },
        mounted(){
            this.update_table()
        }
    }
</script>

