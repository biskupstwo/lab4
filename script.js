let search = document.querySelector('#search');
let form = document.querySelector('#form');
let lista_json = JSON.parse(localStorage.getItem('lista')) || [];
let lista = document.querySelector('#lista');

const generate_id = function () {
  return '_' + Math.random().toString(36).substr(2, 9);
};

const search_cb = (e) => {
  let filtered_list = lista_json.filter(({ label }) =>
    label.toLowerCase().includes(e.target.value.toLowerCase())
  );
  render_data(filtered_list, e.target.value.toLowerCase());
};

const render_data = (data, search_str = '') => {
  document.querySelectorAll('#lista li').forEach((item) => {
    item.remove();
  });
  data.forEach((item) => {
    lista.appendChild(createnode(item, search_str));
  });
};



const createnode = ({ label, date, id }, search_str = '') => {
  let li = document.createElement('li');
  const index = label.toLowerCase().indexOf(search_str.toLowerCase());
  if (search_str && index >= 0) {
    label = `${label.substring(
      0,
      index
    )}<span class="highlight">${label.substring(
      index,
      index + search_str.length
    )}</span>${label.substring(index + search_str.length)}`;
  }
  li.innerHTML = `<li id="${id}"><a class="lista_element" onclick="open_edit('${id}')">${label}</a> ${date}   <a style="color: #E86548" onclick="deletenode('${id}')">Usuń</a></li>`;
  return li;
}

const deletenode = (id) => {
  lista_json = lista_json.filter((object) => object.id !== id);
  render_data(lista_json);
  updateLocalStorage();
};

const open_edit = (id) => {
  let parent = document.getElementById(id);
  let element = parent.querySelector('.lista_element');
  let text = element.textContent;
  let input = document.createElement('input');
  input.type = 'text';
  input.value = text;
  element.style.display = 'none';
  input.onblur = (e) => {
    input.remove();
    element.textContent = e.target.value;
    element.style.display = 'block';
    lista_json.forEach((item) => {
      if (item.id === id) {
        item.label = e.target.value;
      }
    });
    updateLocalStorage();
  };
  parent.insertBefore(input, element);
};



const updateLocalStorage = () => {
  localStorage.setItem('lista', JSON.stringify(lista_json));
};



const setMinDate = () => {
  let date_input = document.querySelector('#bydate');
  date_input.setAttribute('min', new Date().toISOString().split('T')[0]);
};


const addnode = (e) => {
  e.preventDefault();
  let formData = new FormData(form);
  let label = formData.get('todo');
  let date = formData.get('bydate');
  let id = generate_id();
  const data = { label, date, id};
  lista.appendChild(createnode(data));
  lista_json.push(data);
  updateLocalStorage();
  form.reset();
};

form.addEventListener('submit', addnode);
search.addEventListener('keyup', search_cb);
window.addEventListener('load', setMinDate);
window.addEventListener('load', () => render_data(lista_json));