const supabaseUrl = "https://sefhudejbsuktuhllojk.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNlZmh1ZGVqYnN1a3R1aGxsb2prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0ODAwMDQsImV4cCI6MjA3OTA1NjAwNH0.CjzeKYzBTxawX1vnQVz7bMDU5co6gjQLh6frH0M-NNA";

const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const formLogin = document.getElementById('formLogin');
const formComite = document.getElementById('formComite');
const lista = document.getElementById('listaComite');
const contenido = document.getElementById('contenido');
const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');

const USUARIO_VALIDO = "admin"; // usuario simple
const PASSWORD_VALIDA = "1234"; // contraseña simple

// Estado login
let estaLogueado = false;

formLogin.addEventListener('submit', (e) => {
  e.preventDefault();
  const usuario = document.getElementById('usuario').value;
  const password = document.getElementById('password').value;

  // Login simple sin encriptar
  if(usuario === USUARIO_VALIDO && password === PASSWORD_VALIDA) {
    estaLogueado = true;
    formLogin.style.display = 'none';
    contenido.style.display = 'block';
    cargarRegistros();
  } else {
    alert('Usuario o contraseña incorrectos');
  }
});

// Cerrar sesión
cerrarSesionBtn.onclick = () => {
  estaLogueado = false;
  formLogin.style.display = 'block';
  contenido.style.display = 'none';
  formComite.reset();
}

// CRUD funciones
async function cargarRegistros() {
  if (!estaLogueado) return;

  const { data, error } = await supabase
    .from('comite')
    .select('*')
    .order('id', { ascending: true });
  if (error) {
    console.error(error);
    return;
  }
  
  lista.innerHTML = '';
  data.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = `${item.nombre} (${item.email}) `;

    const editarBtn = document.createElement('button');
    editarBtn.textContent = 'Editar';
    editarBtn.onclick = () => {
      document.getElementById('id').value = item.id;
      document.getElementById('nombre').value = item.nombre;
      document.getElementById('email').value = item.email;
    };

    const borrarBtn = document.createElement('button');
    borrarBtn.textContent = 'Borrar';
    borrarBtn.onclick = () => borrarRegistro(item.id);

    li.appendChild(editarBtn);
    li.appendChild(borrarBtn);
    lista.appendChild(li);
  });
}

formComite.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!estaLogueado) {
    alert('Debes iniciar sesión');
    return;
  }
  
  const id = document.getElementById('id').value;
  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  
  if (id) {
    const { error } = await supabase
      .from('comite')
      .update({ nombre, email })
      .eq('id', id);
    if (error) console.error(error);
  } else {
    const { error } = await supabase
      .from('comite')
      .insert([{ nombre, email }]);
    if (error) console.error(error);
  }
  
  formComite.reset();
  cargarRegistros();
});

async function borrarRegistro(id) {
  if (!estaLogueado) return;

  const { error } = await supabase
    .from('comite')
    .delete()
    .eq('id', id);
  if (error) {
    console.error(error);
    return;
  }
  cargarRegistros();
}
