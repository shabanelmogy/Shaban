// Read-only scoped source comparison against pre-edit copies, including untracked files.
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const review = 'F:/My Work/Sigma/reviews';
const walk = dir => fs.existsSync(dir) ? fs.readdirSync(dir, {withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(path.join(dir,e.name)) : [path.join(dir,e.name)]) : [];
for (const [layer,root,extra] of [
  ['frontend','F:/My Work/Sigma/SiGmaAngularFrontEnd',['src/app/modules/HRM/Payroll']],
  ['backend','F:/My Work/Sigma/SigmaBackend',['SiGma.Business/Services/Payrolls','SiGma.ViewModels/ViewModels/PayrollRun','SiGma.ViewModels/ViewModels/PaySlip','SiGma.Business/IServices/IPaySlipService.cs','SiGma.ServerAPI/Controller/PaySlipsController.cs']],
]) {
  const baseline = path.join(review,'PAYROLL_FINAL_SETTLEMENT_PAY_SLIPS_BASELINE',layer);
  const files = new Set(walk(baseline).map(p=>path.relative(baseline,p)));
  for (const rel of extra) { const p = path.join(root,rel); for (const f of fs.existsSync(p) && fs.statSync(p).isFile() ? [p] : walk(p)) files.add(path.relative(root,f)); }
  let output = ''; const changed=[];
  for (const rel of [...files].sort()) {
    const old = path.join(baseline,rel), current=path.join(root,rel);
    if (!fs.existsSync(current)) throw new Error('Missing scoped file '+current);
    const content=fs.readFileSync(current,'utf8');
    if (fs.existsSync(old)) {
      if (fs.readFileSync(old,'utf8')===content) continue;
      const diff=cp.spawnSync('git',['diff','--no-index','--no-ext-diff',old,current],{encoding:'utf8',maxBuffer:10*1024*1024});
      if (![0,1].includes(diff.status)) throw new Error(diff.stderr);
      output+=diff.stdout;
    } else output+='\nNEW '+rel+'\n'+content+'\n';
    changed.push(rel.replaceAll('\\','/'));
  }
  fs.writeFileSync(path.join(review,'PAYROLL_FINAL_SETTLEMENT_PAY_SLIPS_'+layer.toUpperCase()+'_SCOPED.diff'),output);
  console.log(JSON.stringify({layer,root,changed,characters:output.length},null,2));
}
