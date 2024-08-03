function NovaPoshtaMain() {   

  //console.log('npm-load');
  
  const endpointNP        = 'http://api.novaposhta.ua/v2.0/json/';
  const country           = 'Ukraine';
  const provider          = 'Нова пошта';
  const quickIndices      = NP.quickCityIndices.split(' ');
  const bodyNP            = document.getElementById('nova-poshta');
  const deliveryVariants  = document.getElementById('deliveryVariants');
  const deliveryTypes     = document.querySelectorAll('input[type="radio"][name="id"]');
  let deliveryType        = document.querySelector('input[type="radio"][name="id"]:checked').getAttribute('data-type');  
  // Wraps
  const wrapWarehouse     = document.querySelector('.warehouse-wrap');
  const wrapAddresses     = document.querySelector('.address-wrap');
  // Inputs
  const listCity          = document.querySelector('#city_filter'); //document.getElementById('city-search');
  const inputCity         = document.querySelector('[list="city-search"]');
  const listWarehouse     = document.querySelector('#warehouse_filter'); //document.getElementById('warehouse-search');
  const inputWarehouse    = document.querySelector('[list="warehouse-search"]')
  const inputStreet       = document.getElementById('address-street');
  const inputBuild        = document.getElementById('address-build');
  const inputFlat         = document.getElementById('address-flat');
  const inputFields       = document.querySelectorAll('.form-group input');
  const filterFields      = document.querySelectorAll('.dropdown-filter');
  const cityErrorEl       = document.querySelector('.city-wrap .input-error'); 
  const warehouseErrorEl  = document.querySelector('.warehouse-wrap .input-error');
  const streetErrorEl     = document.querySelector('.address-wrap .input-error');
  const clearCity         = document.querySelector(".city-wrap .clear");
  const clearWarehouse    = document.querySelector(".warehouse-wrap .clear");
  const clearStreet       = document.querySelector(".form-street .clear");
  
  
  //const selectedDelivery  = document.querySelector('.selected-delivery');

  const properties = {_provider: provider, _country: country};

  const properties_np_start  = {_provider: provider, _country: country};

  const properties_all_cart  = {_provider: '', _country: null,_delivery_courier_address: null,_delivery_courier_street: null,_delivery_courier_house: null,_delivery_courier_flat: null,_delivery_street_Ref: null, _delivery_city: null,_delivery_city_name: null,_delivery_city_Area: null,_delivery_city_Ref: null,_delivery_warehouse: null,_delivery_warehouse_zip: null,_delivery_warehouse_name: null,_delivery_warehouse_address: null,_delivery_warehouse_CityRef: null,_delivery_warehouse_Number: null,_delivery_warehouse_Ref: null,_delivery_warehouse_SettlementRef: null,_delivery_warehouse_TypeOfWarehouse: null};

  const properties_all_np    = {_delivery_courier_address: null,_delivery_courier_street: null,_delivery_courier_house: null,_delivery_courier_flat: null,_delivery_street_Ref: null, _delivery_city: null,_delivery_city_name: null,_delivery_city_Area: null,_delivery_city_Ref: null,_delivery_warehouse: null,_delivery_warehouse_zip: null,_delivery_warehouse_name: null,_delivery_warehouse_address: null,_delivery_warehouse_CityRef: null,_delivery_warehouse_Number: null,_delivery_warehouse_Ref: null,_delivery_warehouse_SettlementRef: null,_delivery_warehouse_TypeOfWarehouse: null};

  const properties_all_branch  = {_delivery_warehouse: null,_delivery_warehouse_zip: null,_delivery_warehouse_name: null,_delivery_warehouse_address: null,_delivery_warehouse_CityRef: null,_delivery_warehouse_Number: null,_delivery_warehouse_Ref: null,_delivery_warehouse_SettlementRef: null,_delivery_warehouse_TypeOfWarehouse: null};

  const properties_all_courier = {_delivery_courier_street: null,_delivery_courier_house: null,_delivery_courier_flat: null,_delivery_street_Ref: null};


  if (document.querySelector('.button.disabled')) {
  //console.log('removeEventListener');
  let buttonDisabled = document.querySelector('.button.disabled');              
  buttonDisabled.removeEventListener('mouseover', ()=> document.querySelector('#deliveryVariants legend').classList.add('button-hover'));
  buttonDisabled.removeEventListener('mouseout', ()=> document.querySelector('#deliveryVariants legend').classList.remove('button-hover'));
  }
  let dataCities, dataWarehouses, dataStreet, addressCity, addressZip, addressStreet, addressBuild, addressFlat, cityData, warehouseData, address;
  //wrapWarehouse.classList.add('d-none');    
  //wrapAddresses.classList.add('d-none');
  
  if (inputCity.value.length > 0 && inputWarehouse.value.length > 0 ) {
    NP.checkoutButton.classList.remove('disabled');
    NP.checkoutButton.disabled = false;
  } else if (inputCity.value.length > 0 && inputStreet.value.length > 0 ) {
    NP.checkoutButton.classList.remove('disabled');
    NP.checkoutButton.disabled = false;
  } else {
    NP.checkoutButton.classList.add('disabled');
    NP.checkoutButton.disabled = true;
  } 
  controlHover(); 
  /*== update cart note  ==*/
  async function updateCartNote() {
    try {
      const response = await fetch('/cart/update.js', {
        method: 'POST',
        body: JSON.stringify({note: "null"}),
        credentials: 'same-origin',
        cache: 'no-cache',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.json();
    } catch (error) {
      throw error;
    }
  }  
  /*== update cart attribute  ==*/
  async function updateCartDeliveryAttr(data) {
    try {
      const response = await fetch('/cart/update.js', {
        method: 'POST',
        body: JSON.stringify({ attributes: data}),
        credentials: 'same-origin',
        cache: 'no-cache',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      //console.log(JSON.stringify({ attributes: data}));
      return response.json();
    } catch (error) {
      throw error;
    }
  
  }
  /*== Request API ==*/
  async function reqAPI(data) {
    try {
      const response = await fetch(endpointNP, {
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'same-origin',
        cache: 'no-cache',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.json();
    } catch (error) {
      //throw error;
      console.log('error');      
    }
  }
  function clearProperties(data) {
    //console.log(properties_all_cart);
    if (data == 'all') updateCartDeliveryAttr(properties_all_cart).then(function() {/*console.response*/}).catch(alert);
    if (data == 'existing') updateCartDeliveryAttr(properties_all_np).then(function() {/*console.response*/}).catch(alert); 
    if (data == 'branch') updateCartDeliveryAttr(properties_all_branch).then(function() {/*console.response*/}).catch(alert);
    if (data == 'courier') updateCartDeliveryAttr(properties_all_courier).then(function() {/*console.response*/}).catch(alert);
  }
  reqAPI({"apiKey": NP.NP_API_KEY,"modelName": "Address","calledMethod": "searchSettlements","methodProperties": {"CityName" : quickIndices[0],"Limit" : "1","Page" : "1"}})
    .then(res => { console.log(res.success);if (res.success) { mainAPI() } else { errorAPI();} })
      .catch(err => { errorAPI();})  

  //mainAPI();    

  function mainAPI() {

    if (document.querySelector('#type-other').checked) {
      //updateCartDeliveryAttr(properties_all_cart);
      clearProperties('all');
      console.log('update')
    }








    /*== check selected delivery type in cart attribute ==*/
    fetch(`${NP.cartUrl}.json`).then(response => response.json()).then(data => {
      let isDelivery = false;
      wrapWarehouse.classList.add('d-none');    
      wrapAddresses.classList.add('d-none');
      for (var key in data.attributes) {
        const value = data.attributes[key];
        if (!value) continue;
        properties[key] = value;
      }

      if (data.attributes._delivery_type) {
        isDelivery = true;
        deliveryVariants.setAttribute('data-variant', data.attributes._delivery_type);
        document.querySelector('input[type="radio"][name="id"][data-type='+data.attributes._delivery_type+']').checked=true;
        deliveryType = data.attributes._delivery_type;
        properties._delivery_type = deliveryType;
        updateCartDeliveryAttr(properties);
        if(deliveryType == 'courier') {
          wrapAddresses.classList.remove('d-none');
        } 
        if(deliveryType == 'branch') {
          wrapWarehouse.classList.remove('d-none');
        }
      }    
      if (!isDelivery) {
        wrapWarehouse.classList.remove('d-none');
        properties._delivery_type = deliveryType;
        updateCartDeliveryAttr(properties);     
      }
    })
    /*== check changes delivery type ==*/
    deliveryTypes.forEach(function(el){
      el.addEventListener("change", function(){
        deliveryType = this.getAttribute('data-type');
        wrapWarehouse.classList.add('d-none');    
        wrapAddresses.classList.add('d-none');
        inputFields.forEach(function(e){ e.value = '';})
        //cityErrorEl.innerHTML = '';
        warehouseErrorEl.innerHTML = '';
        //streetErrorEl.innerHTML = '';
        filterFields.forEach(function(f){ 
          while(f.firstChild){ filter.removeChild(filter.firstChild);}
        });
        updateCartDeliveryAttr(properties_all_np).then(function() {/*console.response*/}).catch(alert);
        properties._delivery_type = deliveryType;
        if (deliveryType == 'branch') {
          properties._delivery_method = NP.methodBranch;
          wrapWarehouse.classList.remove('d-none');          
        } 
        if (deliveryType == 'courier') { 
          properties._delivery_method = NP.methodCourier;
          wrapAddresses.classList.remove('d-none');         
        }         
        updateCartDeliveryAttr(properties).then(function() {/*console.response*/}).catch(alert);
        selectedDelivery.setAttribute('data-delivery', ''); 
        NP.checkoutButton.classList.add('disabled');
        NP.checkoutButton.disabled = true;
        controlHover();        
             
      })
    })    
    /*== text input clear ==*/
    document.querySelectorAll(".clear").forEach(function(el, index){
      el.addEventListener('click', function() {
        document.querySelectorAll(".form-group input")[index].value = '';
        document.querySelectorAll(".form-group input")[index].readOnly = false;
        document.querySelectorAll(".form-group input")[index].focus();
        this.classList.add('d-none');
        if(index == 0) {
          document.querySelectorAll(".form-group").forEach(function(el) {
            el.querySelector('input').value = '';
            el.querySelector('.clear') ? el.querySelector('.clear').classList.add('d-none') : null;
            el.querySelector("input").readOnly = false;
            clearList(listWarehouse);
            clearList(listCity);
            updateCartDeliveryAttr(properties_all_np).then(function() {/*console.response*/}).catch(alert);
            selectedDelivery.setAttribute('data-delivery', '');
          })
        }
        if(index == 1) {
          updateCartDeliveryAttr(properties_all_branch).then(function() {/*console.response*/}).catch(alert);
          selectedDelivery.setAttribute('data-delivery', '');
        }
        if(index == 2) { 
          updateCartDeliveryAttr(properties_all_courier).then(function() {/*console.response*/}).catch(alert);
          selectedDelivery.setAttribute('data-delivery', '');
        }
        filterFields.forEach(function(f){clearList(f)});
        bodyNP.classList.remove('filter-active');
        warehouseErrorEl.innerHTML = '';
        //cityErrorEl.innerHTML = ''; 
        //streetErrorEl.innerHTML = ''; 
        NP.checkoutButton.classList.add('disabled');
        NP.checkoutButton.disabled = true;
        controlHover();     
      });
    })
    /*== remove filter result list ==*/
    function clearList(filter) {
      while(filter.firstChild){filter.removeChild(filter.firstChild)}
    }  
    function pointPrefix(data) {
      switch (data) {  
        case 'Postomat':
        pointType = 'Поштомат';
          break;
        case 'Branch':
        pointType = 'Відділення';
          break;      
        default:
        pointType = data;
          break;
      }
      return pointType;
    }
    function stripslashes_n(str) {
      return str.replace(/'/g,`ʹ`);
    } 
    /*== search city  ==*/
    function searchCity() { 
      let linkClass = '';        
      let filter = listCity;
      let output_prev = 0;
                
      /* Start Quick City */             
      document.querySelectorAll('a.quick-city-link').forEach(function(city){
        city.addEventListener("click", function(){  //click
          clearCity.classList.remove('d-none');
          inputWarehouse.readOnly = false;
          document.querySelectorAll(".form-group").forEach(function(el){
            if (!el.classList.contains('form-city')) {              
              el.querySelector('input.form-control').value = '';
              el.querySelector('.clear') ? el.querySelector('.clear').classList.add('d-none') : null;
            }
          })
          inputCity.readOnly = true;                       
          addressCity                     = this.getAttribute('data-main');          
          inputCity.value                 = this.getAttribute('data-present');
          properties._delivery_city       = this.getAttribute('data-present');;
          properties._delivery_city_name  = this.getAttribute('data-main');
          properties._delivery_city_Ref   = this.getAttribute('data-ref');
          updateCartDeliveryAttr(properties).then(function(cart) {}).catch(alert);
          clearList(filter);            
            if (deliveryType == 'branch' && this.getAttribute('data-ref') ) {  
              reqAPI({"apiKey": NP.NP_API_KEY,"modelName": "Address","calledMethod": "getWarehouses","methodProperties": {"CityRef" : this.getAttribute('data-ref') }})
                .then(function(res) { dataWarehouses = res.data; searchWarehouse(dataWarehouses); })
                  .catch(alert);                  
            } else if (deliveryType == 'courier' && this.getAttribute('data-ref')) {
              searchStreet(this.getAttribute('data-ref'));
            } else {
              return;
            }
        })
      })      
      /* End Quick City */

      if (inputCity.getAttribute('data-ref').length > 0) {
        let cityRef = inputCity.getAttribute('data-ref');
        if (deliveryType == 'branch') { 
          inputWarehouse.readOnly = false;                     
          reqAPI({"apiKey": NP.NP_API_KEY,"modelName": "Address","calledMethod": "getWarehouses","methodProperties": {"CityRef" : cityRef }})
            .then(function(res) { dataWarehouses = res.data; searchWarehouse(dataWarehouses); })
              .catch(alert); 
        } else if (deliveryType == 'courier') {
          inputStreet.readOnly = false;
          searchStreet(cityRef);
        } 
      } 
      inputCity.addEventListener("keyup", function(event){
        if(event.key != 'ArrowLeft' && event.key != 'ArrowRight' && !inputCity.readOnly) {  
          let searchField = this.value;
          inputWarehouse.value = inputStreet.value = '';
          inputWarehouse.readOnly = false;
          listWarehouse.classList.remove('active');
          clearList(listWarehouse);
          document.getElementById('street_filter').classList.remove('active');
          clearCity.classList.remove('d-none');

          if(searchField === '' || searchField === ' ' ){ clearList(filter);bodyNP.classList.remove('filter-active');cityErrorEl.innerHTML = '';clearCity.classList.add('d-none'); output_prev=0; return;} 
          let output = '', count = 1;

          reqAPI({"apiKey": NP.NP_API_KEY,"modelName": "Address","calledMethod": "searchSettlements","methodProperties": {"CityName" : searchField,"Limit" : "150","Page" : "1", "Warehouse": "1"}})
            .then(function(res) {
              console.log(res.data[0].Addresses); 
              clearList(listCity);
              dataCities = res.data[0].Addresses;
              if(dataCities.length > 0) { clearList(filter); cityErrorEl.innerHTML = '';} else { if(output_prev>0) cityErrorEl.innerHTML = NP.alertCity }; 
            })
              .catch( function() {console.log('error');clearList(filter); cityErrorEl.innerHTML.innerHTML = NP.alertKeyboard });

          setTimeout( function() {
            clearList(listCity);

            if (dataCities.length > 0) {
              dataCities.forEach(function(val){          
                  linkClass = (val.Warehouses == 0 && deliveryType == 'branch' ) ? 'd-none' : '';
                  let cityDataVal = JSON.parse(stripslashes_n(JSON.stringify(val)));
                  output += `<a 
                  data-main='`+cityDataVal.MainDescription+`'
                  data-present='`+cityDataVal.Present+`'
                  data-ref='`+cityDataVal.DeliveryCity+`'
                  class='city-link `+ linkClass +`' 
                  href='javascript:void(0)' 
                  style='display:block;'>`+ val.Present + `</a>`;

                  if (count%1 == 0) output += '';
                  count++; 
              });
            }           
            
            filter.insertAdjacentHTML('afterbegin',output);
           
            if (output_prev > 0) {
            bodyNP.classList.add('filter-active');
            document.getElementById('city_filter').classList.add('active');  
            }
            document.querySelectorAll('a.city-link').forEach(function(city){
              city.addEventListener("click", function(){

                bodyNP.classList.remove('filter-active');
                document.querySelector('.city-wrap .input-error').innerHTML = ""; 

                clearCity.classList.remove('d-none');
                inputCity.readOnly = true;

                addressCity                     = this.getAttribute('data-main');          
                inputCity.value                 = this.getAttribute('data-present');
                properties._delivery_city       = this.getAttribute('data-present');;
                properties._delivery_city_name  = this.getAttribute('data-main');
                properties._delivery_city_Ref   = this.getAttribute('data-ref');

                updateCartDeliveryAttr(properties).then(function(cart) {/*console.log(cart)*/}).catch(alert);
                clearList(filter)
                
                if (deliveryType == 'branch' && this.getAttribute('data-ref') ) {              
                  reqAPI({"apiKey": NP.NP_API_KEY,"modelName": "Address","calledMethod": "getWarehouses","methodProperties": {"CityRef" : this.getAttribute('data-ref') }})
                    .then(function(res) {/*console.log(res.data);*/dataWarehouses = res.data; searchWarehouse(dataWarehouses); })
                      .catch(alert);                  
                } else if (deliveryType == 'courier' && this.getAttribute('data-ref')) {
                  searchStreet(this.getAttribute('data-ref'));
                } else {
                  return;
                } 
              });
            })
            output_prev = output.length ; 
          }, 500)
        }
      });
    }

    /*== search branch/postomat  ==*/
    function _searchWarehouse(data) {
      wrapWarehouse.classList.remove('d-none');      
      //let filter = document.querySelector('#warehouse_filter');    
      if(data.length > 0) {
        let output_options;
        data.forEach(function(val){ 
          let vallArray = JSON.parse(stripslashes_n(JSON.stringify(val)));       
          output_options += `<option
          data-longaddress='`+ vallArray.Description +`'
          data-shortaddress='`+ vallArray.ShortAddress +`' 
          data-cityref='`+ vallArray.CityRef +`'
          data-branchref='`+ vallArray.Ref +`'
          data-settlementref='`+ vallArray.SettlementRef +`'
          data-branchnumber='`+ vallArray.Number +`'
          data-branchtype='`+ vallArray.TypeOfWarehouse +`'
          class='warehouse-link' href='javascript:void(0)' 
          style='display:block;'>` + val.Description + `</option>`;          
        }); 

      listWarehouse.insertAdjacentHTML('afterbegin',output_options);

      inputWarehouse.addEventListener("change", function(el){
          console.log('listchange');          
          var opts = listWarehouse.children;
          for (var i = 0; i < opts.length; i++) {
            if (opts[i].value === this.value) {
              clearWarehouse.classList.remove('d-none');
              console.log(opts[i].value);
              warehouseData = JSON.parse(opts[i].getAttribute('data-val'));
              addressStreet = warehouseData.Description;
              inputWarehouse.value = addressStreet;
              inputWarehouse.readOnly = true;
              addressZip = warehouseData.PostalCodeUA;
              addressZip = '00000';
              addressBuild = addressFlat = ''; 
              properties._delivery_warehouse                 = addressStreet;
              properties._delivery_warehouse_zip             = addressZip;
              properties._delivery_warehouse_name            = pointPrefix(warehouseData.CategoryOfWarehouse)+':'+warehouseData.Number;
              properties._delivery_warehouse_address         = warehouseData.ShortAddress;
              properties._delivery_warehouse_CityRef         = warehouseData.CityRef;
              properties._delivery_warehouse_Number          = warehouseData.Number;
              properties._delivery_warehouse_Ref             = warehouseData.Ref;
              properties._delivery_warehouse_SettlementRef   = warehouseData.SettlementRef;
              properties._delivery_warehouse_TypeOfWarehouse = warehouseData.TypeOfWarehouse;              
              updateCartDeliveryAttr(properties).then(function(cart) {}).catch(alert);
              selectedDelivery.setAttribute('data-delivery', (properties._delivery_city + ', '+properties._delivery_warehouse_name));
              NP.checkoutButton.classList.remove('disabled');
              NP.checkoutButton.disabled = false;
              controlHover();
              break;
            }
          }
        })
        

        /*
        let warehousesLinks = document.querySelectorAll('a.warehouse-link');
        if(warehousesLinks.length > 0) {
          document.getElementById('warehouse_filter').classList.add('active');
        }      

        warehousesLinks.forEach(function(warehouse){

          warehouse.addEventListener("click", function(el){

            clearWarehouse.classList.remove('d-none');
            NP.checkoutButton.classList.remove('disabled');
            NP.checkoutButton.disabled = false;


            warehouseData = JSON.parse(this.getAttribute('data-val'));
            //warehouseErrorEl.innerHTML = '';
            addressStreet = warehouseData.Description;
            inputWarehouse.value = addressStreet;
            inputWarehouse.readOnly = true;
            addressZip = warehouseData.PostalCodeUA;
            addressZip = '00000';
            addressBuild = addressFlat = '';            
            clearList(listWarehouse);
            properties._delivery_warehouse                 = addressStreet;
            properties._delivery_warehouse_zip             = addressZip;
            properties._delivery_warehouse_name            = pointPrefix(warehouseData.CategoryOfWarehouse)+':'+warehouseData.Number;
            properties._delivery_warehouse_address         = warehouseData.ShortAddress;
            properties._delivery_warehouse_CityRef         = warehouseData.CityRef;
            properties._delivery_warehouse_Number          = warehouseData.Number;
            properties._delivery_warehouse_Ref             = warehouseData.Ref;
            properties._delivery_warehouse_SettlementRef   = warehouseData.SettlementRef;
            properties._delivery_warehouse_TypeOfWarehouse = warehouseData.TypeOfWarehouse;          
            
            updateCartDeliveryAttr(properties).then(function(cart) {}).catch(alert);                   
            

            selectedDelivery.setAttribute('data-delivery', (properties._delivery_city + ', '+properties._delivery_warehouse_name));
            
            controlHover(); 






          });

        })  */






      } else {
        NP.checkoutButton.classList.remove('disabled');
        NP.checkoutButton.disabled = false;
        controlHover();
      }
    }

    function searchWarehouse(data) {
      wrapWarehouse.classList.remove('d-none');      
      let filter = document.querySelector('#warehouse_filter');    
      if(data.length > 0) {

        inputWarehouse.addEventListener("keyup", function(event){

          if(event.key != 'ArrowLeft' && event.key != 'ArrowRight') {

            clearWarehouse.classList.remove('d-none');
            
            let searchField = this.value;
            if(searchField === '')  {
              clearList(filter);
              return;
            }        
            let regex = new RegExp(searchField, "i"), output = '', count = 1;
            
            data.forEach(function(val){        
              if ((val.Description.search(regex) != -1)) {
                output += `<a data-val='`+stripslashes_n(JSON.stringify(val))+`' class='warehouse-link' href='javascript:void(0)' style='display:block;'>` + val.Description + `</a>`;
                  if(count%1 == 0) output += '';
                    count++;
              } 
              NP.checkoutButton.classList.add('disabled');
                //checkoutButtonWrapper.classList.add('tool');
                NP.checkoutButton.disabled = true;        
            }); 
          
            if(output.length > 0) { clearList(filter); warehouseErrorEl.innerHTML = '';} else {warehouseErrorEl.innerHTML = alertWarehouse; };

            filter.insertAdjacentHTML('afterbegin',output);
            let warehousesLinks = document.querySelectorAll('a.warehouse-link');
            if(warehousesLinks.length > 0) {
              document.getElementById('warehouse_filter').classList.add('active');
            }      

            warehousesLinks.forEach(function(warehouse){

              warehouse.addEventListener("click", function(el){
                warehouseData = JSON.parse(this.getAttribute('data-val'));
                warehouseErrorEl.innerHTML = '';
                addressStreet = warehouseData.Description;
                inputWarehouse.value = addressStreet;
                inputWarehouse.readOnly = true;
                addressZip = warehouseData.PostalCodeUA;
                addressZip = '00000';
                addressBuild = addressFlat = '';            
                clearList(filter);
                properties._delivery_warehouse                 = addressStreet;
                properties._delivery_warehouse_zip             = addressZip;
                properties._delivery_warehouse_name            = pointPrefix(warehouseData.CategoryOfWarehouse)+':'+warehouseData.Number;
                properties._delivery_warehouse_address         = warehouseData.ShortAddress;
                properties._delivery_warehouse_CityRef         = warehouseData.CityRef;
                properties._delivery_warehouse_Number          = warehouseData.Number;
                properties._delivery_warehouse_Ref             = warehouseData.Ref;
                properties._delivery_warehouse_SettlementRef   = warehouseData.SettlementRef;
                properties._delivery_warehouse_TypeOfWarehouse = warehouseData.TypeOfWarehouse;          
                
              updateCartDeliveryAttr(properties).then(function(cart) {/*console.log(cart)*/}).catch(alert);
              NP.checkoutButton.classList.remove('disabled');
              NP.checkoutButton.disabled = false;
                
              });

            })

          }

        });
      } else {
        checkoutButton.classList.remove('disabled');
        //checkoutButtonWrapper.classList.remove('tool');
        checkoutButton.disabled = false;
      }
    }

    /*== search street  ==*/
    function searchStreet(city) {  
      wrapAddresses.classList.remove('d-none');
      dataStreet = false;
      let streetPref;
      let output_prev = 0;
      inputStreet.addEventListener("keyup", function(event){
        if(event.key != 'ArrowLeft' && event.key != 'ArrowRight') {
          clearStreet.classList.remove('d-none');
          var filter = document.querySelector('#street_filter');  
          var searchField = this.value;
          if(searchField === '' || searchField.includes('&#8291;') || searchField === ' ')  {
            clearList(filter); clearStreet.classList.add('d-none'); streetErrorEl.innerHTML = ''; return;
          }
          if(searchField.includes(streetPref))  {          
            this.value = searchField.split(streetPref)[1];
          }  
        
          
          reqAPI({"apiKey": NP.NP_API_KEY,"modelName": "Address","calledMethod": "getStreet","methodProperties": {"CityRef" : city,"FindByString" : this.value,"Page" : "1","Limit" : ""}})
            .then(function(res) {/*console.log(res.data);*/dataStreet = res.data;})
              .catch(function() {clearList(filter); streetErrorEl.innerHTML = NP.alertKeyboard }); 
          
          var output = '';
          var count = 1;
            
          setTimeout( function() {
            dataStreet.forEach(function(val){ 		  
                output += '<a data-ref="'+val.Ref+'" data-street="'+ val.StreetsType + val.Description +'" data-prefix="'+val.StreetsType+'" class="street-link" href="javascript:void(0)" style="display:block;">' + val.StreetsType + val.Description + '</a>';
                count++;
            });

            if(dataStreet.length > 0 ) {clearList(filter); streetErrorEl.innerHTML = '';} else { if(output_prev > 0) streetErrorEl.innerHTML = alertStreet};
            filter.insertAdjacentHTML('afterbegin',output);

            let streetLinks = document.querySelectorAll('a.street-link');
            if(streetLinks.length > 0) {
              document.getElementById('street_filter').classList.add('active');
            }   
            streetLinks.forEach(function(street){
              street.addEventListener("click", function(el){
                addressStreet = this.getAttribute('data-street');
                inputStreet.value=this.getAttribute('data-street');
                streetPref = this.getAttribute('data-prefix');
                addressZip ='00000';
                clearList(filter);
                properties._delivery_courier_address    = addressStreet;                
                properties._delivery_courier_street     = addressStreet;
                properties._delivery_street_Ref         = this.getAttribute('data-ref');

              updateCartDeliveryAttr(properties).then(function(cart) {/*console.log(cart)*/}).catch(alert);
              selectedDelivery.setAttribute('data-delivery', (properties._delivery_city + ', '+properties._delivery_courier_street));
              NP.checkoutButton.classList.remove('disabled');
                //NP.checkoutButtonWrapper.classList.remove('tool');
              NP.checkoutButton.disabled = false;
              controlHover();
                return;
              });
            })
          output_prev = output.length ;        
          },500);
        }
      });

      inputStreet.addEventListener("focusout", function(){
        if(this.value || this.value != '') {
          addressStreet = 'вул.'+this.value;
          properties._delivery_courier_address  = addressStreet;          
          properties._delivery_courier_street   = addressStreet;
          updateCartDeliveryAttr(properties).then(function(cart) {/*console.log(cart)*/}).catch(alert);
        }
      })      
    }
    /*== input build  ==*/
    inputBuild.addEventListener("keyup", function(){
      addressBuild = ', буд.'+this.value;
    })
    inputBuild.addEventListener("focusout", function(){
      addressStreet = addressStreet+''+addressBuild;
      properties._delivery_courier_address = addressStreet;
      properties._delivery_courier_house   = addressBuild;
      updateCartDeliveryAttr(properties).then(function(cart) {/*console.log(cart)*/}).catch(alert);
    });
    /*== input flat  ==*/
    inputFlat.addEventListener("keyup", function(){
      addressFlat = ', кв.'+this.value;
    })
    inputFlat.addEventListener("focusout", function(){
      addressStreet = addressStreet+''+addressFlat;
      properties._delivery_courier_address = addressStreet;
      properties._delivery_courier_flat    = addressFlat;
      updateCartDeliveryAttr(properties).then(function(cart) {/*console.log(cart)*/}).catch(alert);
    });
    function addErrorMessage() {
      const errorContainer = document.querySelector('.cart-terms .alert-danger');
        
        if (!errorContainer) return false;
      
        if (errorContainer && !(errorContainer.getAttribute('added-text'))) {
            errorContainer.innerHTML += ` ${translations?.shipping_method?.title}`;
        
          errorContainer.setAttribute('added-text', 'true');
          
          return true;
        }
    }
    const errorInterval = setInterval(() => {
      const isSet = addErrorMessage();

      if (isSet !== false) clearInterval(errorInterval);
    }, 100);    
    
    NP.checkoutButton.addEventListener('click', async function(e) {

      let shouldDisable = true;	
      if (shouldDisable) this.classList.add('disabled');
      e.preventDefault();
      e.stopPropagation();
      this.disabled = true;     
      if (document.querySelector('#type-nova-poshta').checked) {
        addressStreet = (addressStreet)?addressStreet:'';
        addressCity = (addressCity)?addressCity:properties._delivery_city_name;
        addressZip = '00000';
        address = ({
          first_name: ' ',
          last_name: ' ',
          address1: (deliveryType == 'branch') ? properties._delivery_warehouse : addressStreet+' ('+NP.methodCourier+')',
          zip: addressZip, 
          city: addressCity,
          country: country
        });
      } else {
        address = ({
          address1: 'Зарічанська 3\/1, офіс 213',
          zip:'29019', 
          city: 'Хмельницький ',
          country: 'Україна'
        });
        updateCartDeliveryAttr(properties_all_cart); 
      }
      setTimeout( function() {
      fetch(`${NP.cartUrl}.json`).then(response => response.json()).then(data => {
          const pairs = [];          
          const path = data.items.map(item => {
            return `${item.variant_id}:${item.quantity}`;
          }).join(',');

          for (var key in properties) {
            const value = properties[key];

            if (!value) continue;

            const pair = `attributes[${key}]=${properties[key]}`;

            pairs.push(pair);
          }

          for (var key in address) {
            const value = address[key];

            if (!value) continue;

            const pair = `checkout[shipping_address][${key}]=${address[key]}`;

            pairs.push(pair);
          }

          let query;
          let url;
          if (data.note && data.note != null) {
          query = pairs.join('&') + `&note=${data.note}`;
          url = `${NP.cartUrl}/${path}?${query}`;
          } else {
          query = pairs.join('&');  
          url = `${NP.cartUrl}/${path}?${query}`;
          }
          console.log(url);
          //alert(url);
          window.location.href = url;

        })
      
      },200); 
        
    });
  
    NP.NovaPoshtaLoad = true;
    searchCity();



  }
  /*== Error API ==*/
  function errorAPI() {   
    console.log('Error API')
  }
}


function widget_load() {     
  console.log('nova-poshta-rendering');
  if (NP.widgetType == 'standart') {      
    document.querySelectorAll('input[type="radio"][name="delivery"]').forEach(function(el){
      el.addEventListener("change", function(){
        if (this.getAttribute('data-type') == 'nova-poshta') {
          console.log('npm-loaded-standart');
          NP.checkoutButton.classList.add('disabled');
          NP.checkoutButton.disabled = true;
          document.querySelector('.warehouse-wrap').classList.add('d-none');
          document.querySelector('.address-wrap').classList.add('d-none');
          if (document.querySelector('input.form-control.input-city').value.length > 0) {
            if (document.querySelector('input[type="radio"][name="id"][data-type="branch"]').checked == true ) {            
              document.querySelector('.warehouse-wrap').classList.remove('d-none');
            } else {
              document.querySelector('.address-wrap').classList.remove('d-none');
              NP.checkoutButton.classList.remove('disabled');
              NP.checkoutButton.disabled = false;
            }
          }
          if (document.querySelector('input.form-control.input-city').value.length > 0  && document.querySelector('input.form-control.input-warehouse').value.length > 0) {
            NP.checkoutButton.classList.remove('disabled');
            NP.checkoutButton.disabled = false;
          }
          if (NP.NovaPoshtaLoad == false) { 
            console.log('nploading');                      
            NovaPoshtaMain();
            NP.NovaPoshtaLoad = true;
          }
        } else {
          
          console.log('npm-destroy type-pickup-1');
          //NovaPoshtaMain();
          NP.checkoutButton.classList.remove('disabled');
          NP.checkoutButton.disabled = false;
          NP.checkoutButton.addEventListener('click', async function(e) {
            console.log('other click');
            let properties  = {_provider: null, _country: null,_delivery_courier_address: null,_delivery_courier_street: null,_delivery_courier_house: null,_delivery_courier_flat: null,_delivery_street_Ref: null, _delivery_city: null,_delivery_city_name: NP.pickup1_city,_delivery_city_Area: null,_delivery_city_Ref: null,_delivery_warehouse: null,_delivery_warehouse_zip: NP.pickup1_zip,_delivery_warehouse_name: null,_delivery_warehouse_address: NP.pickup1_address,_delivery_warehouse_CityRef: null,_delivery_warehouse_Number: null,_delivery_warehouse_Ref: null,_delivery_warehouse_SettlementRef: null,_delivery_warehouse_TypeOfWarehouse: null};
            let address = { address1: '  ', zip:'  ', city: '  '};
            let shouldDisable = true;	
              if (shouldDisable) this.classList.add('disabled');
              e.preventDefault();
              e.stopPropagation();
              this.disabled = true;             
              setTimeout( function() {
              fetch(`${NP.cartUrl}.json`).then(response => response.json()).then(data => {
                  var pairs = [];          
                  var path = data.items.map(item => {
                    return `${item.variant_id}:${item.quantity}`;
                  }).join(',');
        
                  for (var key in properties) {
                    const value = properties[key];
        
                    if (!value) continue;
        
                    const pair = `attributes[${key}]=${properties[key]}`;
        
                    pairs.push(pair);
                  }
        
                  for (var key in address) {
                    const value = address[key];
        
                    if (!value) continue;
        
                    const pair = `checkout[shipping_address][${key}]=${address[key]}`;
        
                    pairs.push(pair);
                  }
        
                  let query;
                  let url;
                  if (data.note && data.note != null) {
                  query = pairs.join('&') + `&note=${data.note}`;
                  url = `${NP.cartUrl}/${path}?${query}`;
                  } else {
                  query = pairs.join('&');  
                  url = `${NP.cartUrl}/${path}?${query}`;
                  }
                  console.log(url);
                  window.location.href = url;
        
                })              
              },800);               
          });
        }
      });
    });
  } else {
    console.log('npm-loaded-only');
    NP.checkoutButton.classList.add('disabled');
    NP.checkoutButton.disabled = true;
    document.querySelector('.warehouse-wrap').classList.add('d-none');
    document.querySelector('.address-wrap').classList.add('d-none');
    if (document.querySelector('input.form-control.input-city').value.length > 0) {
      if (document.querySelector('input[type="radio"][name="id"][data-type="branch"]').checked == true ) {            
        document.querySelector('.warehouse-wrap').classList.remove('d-none');
      } else {
        document.querySelector('.address-wrap').classList.remove('d-none');
        NP.checkoutButton.classList.remove('disabled');
        NP.checkoutButton.disabled = false;
      }
    }
    if (document.querySelector('input.form-control.input-city').value.length > 0  && document.querySelector('input.form-control.input-warehouse').value.length > 0) {
      NP.checkoutButton.classList.remove('disabled');
      NP.checkoutButton.disabled = false;
    }
    if (NP.NovaPoshtaLoad == false) { 
      console.log('nploading');                      
      NovaPoshtaMain();
      NP.NovaPoshtaLoad = true;
    }
  }
}
function addHover() {
  document.querySelector('#deliveryVariants legend').classList.add('button-hover');
}
function removeHover() {
  document.querySelector('#deliveryVariants legend').classList.remove('button-hover');
}
function controlHover() {  
  if (NP.checkoutButton.classList.contains('disabled')) {
    NP.checkoutButton.addEventListener('mouseover', addHover, true);
    NP.checkoutButton.addEventListener('mouseout', removeHover, true);
  } else {
    NP.checkoutButton.removeEventListener('mouseover', addHover, true);
    NP.checkoutButton.removeEventListener('mouseout', removeHover, true);
  }
}
function nphtml() { 
  console.log('html start');

  /*== loading ==*/ 
  window.NP.checkoutButton = document.querySelector(NP.selectorCheckoutButton);
  NP.checkoutButton.classList.add('disabled');
  NP.checkoutButton.disabled = true;
  let elementParent = document.querySelector(NP.selectorParent);
  elementParent.classList.add('poshta-content');
  elementParent.insertAdjacentHTML('afterbegin',NP.widgetHTML); 
  window.selectedDelivery  = document.querySelector('.selected-delivery');
  
  if (selectedDelivery.getAttribute('data-delivery').length <= 0) {
    NP.checkoutButton.classList.add('disabled');
    NP.checkoutButton.disabled = true;
    let buttonDisabled = document.querySelector(NP.selectorCheckoutButton +'.disabled');
    buttonDisabled.addEventListener('mouseover', addHover, true);
    buttonDisabled.addEventListener('mouseout', removeHover, true);
  } 
  
  widget_load();
  console.log('html loaded');  
}