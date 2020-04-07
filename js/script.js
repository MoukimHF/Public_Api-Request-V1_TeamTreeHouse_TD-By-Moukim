const gallery = document.getElementById('gallery');
/**
  using fetch to grab 12 users for the page
 */
function fetchUser() {
	fetch('https://randomuser.me/api/?results=12&nat=gb,us').then(response => response.json()).then(data => data.results).then(generateHTML).catch(err => {
		console.log(new Error(err));
		gallery.innerHTML = '<h3>oops!  error receiving the users !</h3>';
	});
}
fetchUser();
//modal window hide with some jquery animation
function modalWindowHide() {
	$(".modal-container").hide('slow', function() {
		$(".modal-container").remove();
	});
}
//fixing the date grabbed from the api
function datefix(date) {
	let dates = date.split('T');
	return dates[0];
}
// generating html for each user in the home page
function generateHTML(data) {
	const users = data.map((user, index) => {
		const section = document.createElement('section');
		gallery.appendChild(section);
		console.log(index);
		listenForClick(user, data, index);
		section.innerHTML = `
        <div class="card" id="${user.name.first}" >
         <div class="card-img-container">
           <img class="card-img" src=${user.picture.medium}>
         </div>
          
           <div class="card-info-container">
           <h3 id="name" class="card-name cap">${user.name.title+" "+user.name.first+" "+user.name.last}</h2>
           <p class="card-text">${user.email}</p>
           <p class="card-text cap">${user.location.city+" "+user.location.country}</p>
           </div>
          </div> `;
	}).join('');
}
// creating the modal 
function createModal(user, data, index) {
	const div = document.createElement("div");
	div.classList.add("modal-container");
	gallery.append(div);
	const divModal = document.createElement("div");
	divModal.classList.add("modal");
	div.append(divModal);
	const btnClose = document.createElement("button");
	btnClose.classList.add("modal-close-btn");
	btnClose.setAttribute("id", "modal-close-btn");
	divModal.append(btnClose);
	const divInfo = document.createElement("div");
	divInfo.classList.add("modal-info-container");
	divModal.append(divInfo);
	divInfo.innerHTML = `
    
    
      <img class="card-img" src=${user.picture.medium}>
     
      <h3 id="name" class="card-name cap">${user.name.title+" "+user.name.first+" "+user.name.last}</h2>
      <p class="card-text">${user.email}</p>
      <p class="card-text">${user.location.city}</p>
      <hr>
      <p class="card-text cap">${user.location.street.number+","+user.location.street.name+" "+user.location.state+" "+user.location.postcode}</p>
      <p class="card-text">Phone :${user.cell}</p>
      <p class="card-text">date of birthday :${datefix(user.dob.date)}</p>
      <div class="modal-btn-container">
      <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
      <button type="button" id="modal-next" class="modal-next btn">Next</button>
  </div>
    `;
	//disabling next and previous buttons when the end or the beginning of the list is reached
	if (index >= 11) document.querySelector('#modal-next').disabled = true;
	else document.querySelector('#modal-next').disabled = false;
	if (index <= 0) document.querySelector('#modal-prev').disabled = true;
	else document.querySelector('#modal-prev').disabled = false;
	const closeButton = document.querySelector('#modal-close-btn');
	closeButton.addEventListener('click', () => {
		modalWindowHide();
	});
	// Click EventListener for next button
	document.querySelector('#modal-next').addEventListener('click', e => {
		div.remove();
		nextUser(data, index)
	})
	// Click EventListener for previous button
	document.querySelector('#modal-prev').addEventListener('click', e => {
		div.remove();
		previousUser(data, index)
	})
}
// Shows next user
function nextUser(data, index) {
	let item = data[index += 1];
	createModal(item, data, index);
	if (index >= 11) {
		document.querySelector('#modal-next').disabled = true;
		document.querySelector('#modal-next').style.backgroundColor = "black";
		document.querySelector('#modal-next').style.cursor = "default";
	} else document.querySelector('#modal-next').disabled = false;
}
// Shows previous user
function previousUser(data, index) {
	let item = data[index -= 1];
	createModal(item, data, index);
	if (index <= 0) {
		document.querySelector('#modal-prev').disabled = true;
		document.querySelector('#modal-prev').style.backgroundColor = "black";
		document.querySelector('#modal-prev').style.cursor = "default";
	} else document.querySelector('#modal-prev').disabled = false;
}
/**
 * Click event for for modal
 * @param {object} item - data on individual user 
 * @param {object} data - all the data
 * @param {object} index - current users index 
 */
function listenForClick(user, data, index) {
	setTimeout(event => {
		const person = document.querySelector(`#${user.name.first}`);
		person.addEventListener('click', e => createModal(user, data, index));
	}, 0)
}
// appending and creating the search function 
function search() {
	const searchContainer = document.querySelector('.search-container');
	const form = document.createElement('form');
	searchContainer.append(form);
	form.innerHTML = ` <input type="search" id="search-input" class="search-input" placeholder="Search...">
                            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
                            `;
	document.getElementById('search-submit').addEventListener('click', (e) => {
		e.preventDefault();
		const input = document.getElementById('search-input');
		let list = document.querySelectorAll('#gallery>section');
		console.log(list.length);
		let listNames = document.querySelectorAll('#name');
		for (let i = 0; i < list.length; i++) {
			let name = listNames[i].innerText.toLowerCase();
			if (name.includes(input.value)) {
				list[i].style.display = 'block';
			} else {
				list[i].style.display = 'none';
			}
		}
	});
}
//calling search function
search();