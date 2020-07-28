# Club tools

## Availability


## Send invoices
### Setup

### Spreadsheets
* Match register - https://docs.google.com/spreadsheets/d/1AXv67zQf-lgleOlb4GOr0uwbebWpdYF5axw0Yj-w9fc/edit#gid=36464533
* 100 Club - https://docs.google.com/spreadsheets/d/1UptLUId9YIcORHHlubzcIDEZGnaiZ9UR9rZt3dAfqro/edit#gid=1593497722

### To crete draft invoices
These are generated from contact forms at the moment.
* Open each contact form and output to a spreadsheet tab
* Copy the register to the `To invoice` tab
* Add the match and date columns in the format `A Team, Home vs Whoever` and `2020-07-20`
* Mark sub type with:
  * `A` - Adult
  * `A1` - Adult with one 100 Club number. Replace with 2 or 3 for more.
  * `S` - Student
  * `Y` - Youth
* Run `yarn start sendinvoices -d` to do a dry run and check output
* Run `yarn start sendinvoices` to create draft invoices
* Check PayPal UI and send invoices
* In spreadsheet, move players from `To invoice` tab to `Historical register` tab

### TODO
* Allow to send draft invoices