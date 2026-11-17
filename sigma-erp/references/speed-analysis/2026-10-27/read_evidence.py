import json
from pathlib import Path
from collect import process
paths=[
'vehicle-leasing-software/features/',
'vehicle-leasing-software/user-guide/how-to-manage-lease-inquiries/',
'vehicle-leasing-software/user-guide/define-and-handle-quotations/',
'vehicle-leasing-software/user-guide/manage-master-agreements/',
'vehicle-leasing-software/user-guide/how-to-define-and-manage-agreements/',
'vehicle-leasing-software/user-guide/how-to-set-cost-parameters/',
'vehicle-leasing-software/user-guide/how-to-manage-cost-settings/',
'vehicle-leasing-software/user-guide/how-to-define-and-adjust-tariff/',
'vehicle-leasing-software/user-guide/how-to-manage-monthly-rental-calculations/',
'vehicle-leasing-software/user-guide/how-to-define-monthly-invoicing-and-lease-invoicing/',
'car-rental-software/features/',
'car-rental-software/user-guide/monthly-invoicing-rules-settings-for-monthly-rental/',
'car-rental-software/user-guide/early-closing-of-monthly-rental-setting/',
'car-rental-software/user-guide/rental-agreement-deposit-management/',
'car-rental-software/user-guide/vehicle-replacement-on-a-rental-agreement/',
'financial-system/features/',
'financial-system/user-guide/',
'uk-vehicle-safety-check-system/features/',
'limo-software/web-app/',
'e-fuel-management-system/',
'e-toll-download-system/',
'vehicle-leasing-software/user-guide/how-to-define-and-manage-roles/',
]
out=[]
for path in paths:
    r=process('https://speedautosystems.com/'+path)
    out.append({k:r.get(k) for k in ['url','title','text','status']})
Path(__file__).with_name('evidence.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
for r in out:
    print('\nSOURCE',r['url'],'\n',r.get('text',''))
