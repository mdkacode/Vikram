image Upload

if quer.image then it will download from the internet
else it will be files

##Filters

req.query => always Filter

and req.body => updated Values# Anil

# Anil

# anil-backend

## category

searh by category `http://localhost:3000/ShopProducts/namelist?_id=5ebfbeb699867dc8203b38ce&products.cIds=5ebfba9aa70ed6c5cbb6de10`
`products.cIds => Categories`

### addToCart

for creating new cart => `api/usercart/add?userId=9839284651` (POST)

for upadting order => `api/usercart/update/9936142128/9936142128cart?userId=9839284651` (PUT)
{
"storeId": "anrag2",
"prodcucts": [
{
"item": "amrood",
"name":"shp1"
},
{
"item": "apple"
},
{
"item": "guava"
}
]
}

### ORDER QUERIES

for getting failed order => `http://localhost:3001/api/usercart/find?userId=9936142128&isFailed=1`
for getting Success order => `http://localhost:3001/api/usercart/find?userId=9936142128`
