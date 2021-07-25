from argparse import ArgumentParser
from money.reusing.github import download_from_github
from os import remove

def replace_in_file(filename, s, r):
    data=open(filename,"r").read()
    remove(filename)
    data=data.replace(s,r)
    f=open(filename, "w")
    f.write(data)
    f.close()

parser=ArgumentParser()
parser.add_argument('--local', help='Parses files without download', action="store_true", default=False)
args=parser.parse_args()      

if args.local==False:
    download_from_github("turulomio", "reusingcode", "vue/components/ChartPie.vue", "src/components/reusing")
    download_from_github("turulomio", "reusingcode", "vue/components/MyDatePicker.vue", "src/components/reusing")
    download_from_github("turulomio", "reusingcode", "vue/components/AutoCompleteApiOneField.vue", "src/components/reusing")

