<template>
    <div>    
        <h1>{{ $t('Concepts catalog') }}
            <MyMenuInline :items="menuinline_items" :context="this"></MyMenuInline>
        </h1>
        <v-data-table dense :headers="investments_headers" :search="search" :items="concepts" sort-by="id" class="elevation-1 ma-4" hide-default-footer disable-pagination :loading="loading" :key="key">
            <template v-slot:[`item.editable`]="{ item }">
                <v-icon small v-if="item.editable" >mdi-check-outline</v-icon>
            </template>             
           <template v-slot:[`item.operationstypes`]="{ item }">
               <div v-html="$store.getters.getObjectPropertyByUrl('operationstypes',item.operationstypes,'localname')"></div>
           </template>           
           <template v-slot:[`item.name`]="{ item }">
               <div v-html="item.name" :class="(item.editable==true && item.id<1000) ? 'boldred' : ''"></div>
           </template>
            <template v-slot:[`item.balance_user`]="{ item }">
                <div v-html="localcurrency_html(item.balance_user )"></div>
            </template>          
            <template v-slot:[`item.actions`]="{ item }">
                <v-icon v-if="item.editable" small class="ml-1" @click="editItem(item)">mdi-pencil</v-icon>
                <v-icon v-if="item.editable && item.used==0" small class="ml-1" @click="deleteItem(item)">mdi-delete</v-icon>
                <v-icon v-if="item.migrable" small class="ml-1" @click="migrateConcept(item)" color="#9933ff" style="font-weight:bold">mdi-folder-move-outline</v-icon>     
            </template>                
        </v-data-table>
        <!-- DIALOG CONCEPTS ADD/UPDATE -->
        <v-dialog v-model="dialog_concepts_cu" max-width="550">
            <v-card class="pa-8">
                <ConceptsCU :concept="concept" :deleting="concept_deleting" :key="key" @cruded="on_ConceptsCU_cruded"></ConceptsCU>
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
    import MyMenuInline from './MyMenuInline.vue'
    import ConceptsCU from './ConceptsCU.vue'
    import ConceptsMigration from './ConceptsMigration.vue'
    import {empty_concept} from '../empty_objects.js'
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
                    { text: this.$t('Id'), sortable: true, value: 'id',width:"3%"},
                    { text: this.$t('Editable'), value: 'editable',  width: "3%", align:'right'},
                    { text: this.$t('Name'), value: 'name'},
                    { text: this.$t('Operation type'), value: 'operationstypes'},
                    { text: this.$t('Used'), value: 'used'},
                    { text: this.$t('Actions'), value: 'actions', sortable: false , width: "10%"},
                ],
                concepts:[],
                menuinline_items: [
                    {
                        subheader: this.$t("Investment options"),
                        children: [
                            {
                                name: this.$t("Add a new concept"),
                                icon: "mdi-plus",
                                code: function(this_){
                                    this_.concept=this_.empty_concept()
                                    this_.key=this_.key+1
                                    this_.concept_deleting=false
                                    this_.dialog_concepts_cu=true
                                },
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
                concept_deleting:null,

                //Dialog ConceptsMigration
                dialog_concepts_migration:false


            }
        },
        methods: {
            deleteItem (item) {
                this.concept=item
                this.key=this.key+1
                this.concept_deleting=true
                this.dialog_concepts_cu=true
            },
            editItem (item) {
                this.concept=item
                this.key=this.key+1
                this.concept_deleting=false
                this.dialog_concepts_cu=true
             },
            migrateConcept(item){
                this.concept=item
                this.key=this.key+1
                this.dialog_concepts_migration=true
            },
            empty_concept,
            on_ConceptsCU_cruded(){
                this.dialog_concepts_cu=false,
                this.$store.dispatch("getConcepts")
                this.update_table()
            },
            on_ConceptsMigration_cruded(){
                this.dialog_concepts_migration=false
                this.update_table()
            },
            update_table(){
                this.loading=true
                axios.get(`${this.$store.state.apiroot}/api/concepts/used/`, this.myheaders())
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

