#!/bin/bash
echo "" > database/allocations.json
i=0
while [ $i -lt 14 ]; do
  echo "$i"
  curl --data "id=$i" "http://www.doc.ic.ac.uk/~cmy14/mbssas/api.php?action=allocate"
  i=$((i+1))
done
