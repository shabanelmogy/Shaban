import json
from pathlib import Path
from collect import process
paths=['car-rental-software/user-guide/rental-bookings-management/','car-rental-software/user-guide/rental-agreement-advance-amount-handling/','car-rental-software/user-guide/monthly-rental-agreement-invoicing/','car-rental-software/user-guide/daily-rental-agreement-invoicing/','car-rental-software/user-guide/rental-agreement-final-settlement-receipt/','car-rental-software/user-guide/rental-agreement-cut-short/','vehicle-leasing-software/user-guide/how-to-add-a-new-vehicle/','vehicle-leasing-software/user-guide/how-to-download-process-fines/','vehicle-leasing-software/user-guide/how-to-download-process-tolls/','vehicle-leasing-software/user-guide/data-import-management/','vehicle-leasing-software/user-guide/how-to-manage-audit-trails/','limo-software/web-app/','speed-human-resource-management/','speed-customer-relationship-management/','garage-management-system/']
out=[]
for p in paths:
    r=process('https://speedautosystems.com/'+p)
    out.append({k:r.get(k) for k in ['url','text','title','status']})
Path(__file__).with_name('evidence-more.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
for r in out:print('\nSOURCE',r['url'],'\n',r.get('text'))
