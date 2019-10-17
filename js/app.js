

function addPharm(){
    document.getElementById('pharm-input').removeAttribute("hidden");
    document.getElementById('edit-pharm').setAttribute("hidden", true);
    document.getElementById('del-pharm').setAttribute("hidden", true);
    document.getElementById('list-section').setAttribute("hidden", true);
    document.getElementById('add-btn').setAttribute("hidden", true);
}


function fillPharm(data){
  document.getElementById('edit-pharm').removeAttribute("hidden");
  document.getElementById('del-pharm').removeAttribute("hidden");
  document.getElementById('pharm-input').removeAttribute("hidden");
  document.getElementById('save-pharm').setAttribute("hidden", true);
  document.getElementById('list-section').setAttribute("hidden", true);
  document.getElementById('add-btn').setAttribute("hidden", true);

  document.getElementById('pharm-name').value = data.name
  document.getElementById('district').value = data.district
  document.getElementById('size').value = data.size
  document.getElementById('id').value = data._id
  document.getElementById('rev').value = data._rev

}

function getPharm(){
  //alert('clicked')
  document.addEventListener('click', function(e) {
    e = e || window.event;
    var target = e.target || e.srcElement
    //, text = target.textContent || target.innerText; 
    id = target.id
    rev = target.getElementsByTagName('span')[1].innerText
    size = target.getElementsByTagName('em')[0].innerText
    name = target.getElementsByTagName('span')[0].innerText
    district = target.getElementsByTagName('kbd')[0].innerText

    data = {
      _id: id,
      _rev: rev,
      name: name,
      district: district,
      size: size
    }
    console.log(data)
    fillPharm(data)
  }, false);
  
}


function getAllData(){
  
  fetch('http://127.0.0.1:5984/pharm_dir/_all_docs?include_docs=true')
    .then(response => response.json())
    .then(function(data){
      rows = data.rows
      for (let i = 0; i < rows.length; i++){
          var a = document.createElement('a')
          a.id = rows[i].doc._id
          a.href = '#'
          a.classList.add("list-group-item");
          a.classList.add("list-group-item-action")
          a.setAttribute("onclick","getPharm()");
          var name = document.createElement('span')
          name.innerText = rows[i].doc.name 
          var loc = document.createElement('kbd')
          loc.innerText = rows[i].doc.district 
          var b = document.createElement('b')
          b.style.cssFloat =  'right'
          var em = document.createElement('em')
          em.innerText = rows[i].doc.size
          var span = document.createElement('span')
          span.id = rows[i].doc._rev
          span.innerText = rows[i].doc._rev
          span.setAttribute("hidden", true);
          b.appendChild(em)
          a.appendChild(name)
          a.appendChild(document.createTextNode("\u00A0"))
          a.appendChild(loc)
          a.appendChild(b)
          a.appendChild(span)
          document.getElementById("list-container").appendChild(a)
        }
    })
    .catch(err => console.log(err))

}

function saveToCouch(){
    document.getElementById('pharm-input').setAttribute("hidden", true);
    document.getElementById('list-section').removeAttribute("hidden");
    document.getElementById('add-btn').removeAttribute("hidden");

    var formData = {
        name: document.getElementById("pharm-name").value + ' Pharmacy',
        district: document.getElementById("district").value,
        size: document.getElementById("size").value,
        id: String(new Date().getTime()),
        
    }
    console.log(JSON.stringify(formData))


    fetch('http://127.0.0.1:5984/pharm_dir/'+formData.id, {
      method: 'PUT',
      body: JSON.stringify(formData),
      })
      .then(response => {
        alert('Saved '+formData.name)
        getAllData()
      })
      .catch(err => console.log(err))
}

function deletePharm(){
  var id = document.getElementById('id').value
  var rev = document.getElementById('rev').value

  fetch('http://127.0.0.1:5984/pharm_dir/'+id+'?rev='+rev, {
    method: 'DELETE',
    })
    .then(response => {
      console.log(response.json)
      getAllData()
      document.getElementById('pharm-input').setAttribute("hidden", true);
      document.getElementById('list-section').removeAttribute("hidden");
      document.getElementById('add-btn').removeAttribute("hidden");
    })
    .catch(err => console.log(err))
}

function editPharm(){
  document.getElementById('pharm-input').setAttribute("hidden", true);
  document.getElementById('list-section').removeAttribute("hidden");
  document.getElementById('add-btn').removeAttribute("hidden");
  var formData = {
    name: document.getElementById('pharm-name').value,
    district: document.getElementById('district').value, 
    size: document.getElementById('size').value, 
    _id: document.getElementById('id').value, 
    _rev: document.getElementById('rev').value,  
  }


  fetch('http://127.0.0.1:5984/pharm_dir/'+formData._id, {
    method: 'PUT',
    body: JSON.stringify(formData),
    })
    .then(response => {
      alert('Edited '+data.name)
      getAllData()
    })
    .catch(err => console.log(err))
}


function createDB(){
  fetch('http://127.0.0.1:5984/pharm_dir', {
    method: 'PUT',
    })
    .then(response => response.json())
    .catch(err => console.log(err))
}

window.onload = function() {
    
    document.getElementById('pharm-input').setAttribute("hidden", true);
    this.createDB()
    this.getAllData()
    
};