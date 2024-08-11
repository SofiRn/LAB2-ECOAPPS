// Agregar eventos a los botones y formularios
document.getElementById('fetch-button').addEventListener('click', fetchData);
document.getElementById('post-form').addEventListener('submit', createPost);

let userMap = {};

// Función para obtener datos de los posts y usuarios
async function fetchData() {
	renderLoadingState();
	try {
		const postsResponse = await fetch('http://localhost:3004/posts');
		const usersResponse = await fetch('http://localhost:3004/users');

		if (!postsResponse.ok || !usersResponse.ok) {
			throw new Error('Network response was not ok');
		}

		const posts = await postsResponse.json();
		const users = await usersResponse.json();

		// Mapear IDs de usuario a nombres de usuario
		userMap = {};
		users.forEach((user) => {
			userMap[user.id] = user.name;
		});

		console.log('User Map:', userMap); // Depuración: revisar el mapa de usuarios

		renderData(posts, userMap);
	} catch (error) {
		renderErrorState();
	}
}

// Función para crear un nuevo post
async function createPost(event) {
	event.preventDefault();

	const userName = document.getElementById('name').value;
	const title = document.getElementById('title').value;
	const body = document.getElementById('body').value;

	try {
		let userId = Object.keys(userMap).find((key) => userMap[key] === userName);
		console.log('Creating post for user:', userName, 'UserID:', userId); // Depuración

		if (!userId) {
			// Crear nuevo usuario si no se encuentra en el mapa
			const userResponse = await fetch('http://localhost:3004/users', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name: userName }),
			});

			if (!userResponse.ok) {
				throw new Error('Failed to create user');
			}

			const newUser = await userResponse.json();
			userId = newUser.id;
			userMap[userId] = newUser.name;

			console.log('New user created:', newUser); // Depuración
		}

		const response = await fetch('http://localhost:3004/posts', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ userId, title, body }),
		});

		if (!response.ok) {
			throw new Error('Failed to create post');
		}

		console.log('Post created successfully'); // Depuración
		const newPost = await response.json();

		// Prepend el nuevo post directamente
		prependPost(newPost, userMap);

		// No necesitamos hacer fetchData() aquí porque ya hemos agregado el nuevo post al DOM.
	} catch (error) {
		console.error('Error creating post:', error);
	}
}

// Función para eliminar un post
async function deletePost(postId) {
	try {
		const response = await fetch(`http://localhost:3004/posts/${postId}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			throw new Error('Failed to delete post');
		}

		console.log('Post deleted successfully'); // Depuración
		fetchData();
	} catch (error) {
		console.error('Error deleting post:', error);
	}
}

// Función para mostrar el estado de error
function renderErrorState() {
	const container = document.getElementById('data-container');
	container.innerHTML = ''; // Limpiar datos anteriores
	container.innerHTML = '<p>Failed to load data</p>';
	console.log('Failed to load data');
}

// Función para mostrar el estado de carga
function renderLoadingState() {
	const container = document.getElementById('data-container');
	container.innerHTML = ''; // Limpiar datos anteriores
	container.innerHTML = '<p>Loading...</p>';
	console.log('Loading...');
}

// Función para renderizar los datos obtenidos
function renderData(posts, userMap) {
	const container = document.getElementById('data-container');
	container.innerHTML = ''; // Limpiar datos anteriores

	// Mostrar los posts en orden inverso para que los más recientes estén arriba
	posts.reverse().forEach((post) => {
		prependPost(post, userMap);
	});
}

// Función para agregar un nuevo post en la parte superior
function prependPost(post, userMap) {
	const container = document.getElementById('data-container');
	const userName = userMap[post.userId] || 'Unknown User';

	const div = document.createElement('div');
	div.className = 'item';
	div.innerHTML = `
        <strong>${userName}</strong>
        <h4>${post.title}</h4>
        <p>${post.body}</p>
        <button onclick="deletePost(${post.id})">Delete</button>
    `;

	// Insertar el nuevo post al inicio del contenedor
	container.insertBefore(div, container.firstChild);
}

// // Agregar eventos a los botones y formularios
// document.getElementById('fetch-button').addEventListener('click', fetchData);
// document.getElementById('post-form').addEventListener('submit', createPost);

// let userMap = {};

// // Función para obtener datos de los posts y usuarios
// async function fetchData() {
// 	renderLoadingState();
// 	try {
// 		const postsResponse = await fetch('http://localhost:3004/posts');
// 		const usersResponse = await fetch('http://localhost:3004/users');

// 		if (!postsResponse.ok || !usersResponse.ok) {
// 			throw new Error('Network response was not ok');
// 		}

// 		const posts = await postsResponse.json();
// 		const users = await usersResponse.json();

// 		// Mapear IDs de usuario a nombres de usuario
// 		userMap = {};
// 		users.forEach((user) => {
// 			userMap[user.id] = user.name;
// 		});

// 		console.log('User Map:', userMap); // Depuración: revisar el mapa de usuarios

// 		renderData(posts, userMap);
// 	} catch (error) {
// 		renderErrorState();
// 	}
// }

// // Función para crear un nuevo post
// async function createPost(event) {
// 	event.preventDefault();

// 	const userName = document.getElementById('name').value;
// 	const title = document.getElementById('title').value;
// 	const body = document.getElementById('body').value;

// 	try {
// 		let userId = Object.keys(userMap).find((key) => userMap[key] === userName);
// 		console.log('Creating post for user:', userName, 'UserID:', userId); // Depuración

// 		if (!userId) {
// 			// Crear nuevo usuario si no se encuentra en el mapa
// 			const userResponse = await fetch('http://localhost:3004/users', {
// 				method: 'POST',
// 				headers: {
// 					'Content-Type': 'application/json',
// 				},
// 				body: JSON.stringify({ name: userName }),
// 			});

// 			if (!userResponse.ok) {
// 				throw new Error('Failed to create user');
// 			}

// 			const newUser = await userResponse.json();
// 			userId = newUser.id;
// 			userMap[userId] = newUser.name;

// 			console.log('New user created:', newUser); // Depuración
// 		}

// 		const response = await fetch('http://localhost:3004/posts', {
// 			method: 'POST',
// 			headers: {
// 				'Content-Type': 'application/json',
// 			},
// 			body: JSON.stringify({ userId, title, body }),
// 		});

// 		if (!response.ok) {
// 			throw new Error('Failed to create post');
// 		}

// 		console.log('Post created successfully'); // Depuración
// 		const newPost = await response.json();
// 		prependPost(newPost, userMap);

// 		// Volver a cargar los datos para actualizar la vista
// 		fetchData();
// 	} catch (error) {
// 		console.error('Error creating post:', error);
// 	}
// }

// // Función para eliminar un post
// async function deletePost(postId) {
// 	try {
// 		const response = await fetch(`http://localhost:3004/posts/${postId}`, {
// 			method: 'DELETE',
// 		});

// 		if (!response.ok) {
// 			throw new Error('Failed to delete post');
// 		}

// 		console.log('Post deleted successfully'); // Depuración
// 		fetchData();
// 	} catch (error) {
// 		console.error('Error deleting post:', error);
// 	}
// }

// // Función para mostrar el estado de error
// function renderErrorState() {
// 	const container = document.getElementById('data-container');
// 	container.innerHTML = ''; // Limpiar datos anteriores
// 	container.innerHTML = '<p>Failed to load data</p>';
// 	console.log('Failed to load data');
// }

// // Función para mostrar el estado de carga
// function renderLoadingState() {
// 	const container = document.getElementById('data-container');
// 	container.innerHTML = ''; // Limpiar datos anteriores
// 	container.innerHTML = '<p>Loading...</p>';
// 	console.log('Loading...');
// }

// // Función para renderizar los datos obtenidos
// function renderData(posts, userMap) {
// 	const container = document.getElementById('data-container');
// 	container.innerHTML = ''; // Limpiar datos anteriores

// 	if (posts.length > 0) {
// 		// Invertir los posts para que los más recientes estén arriba
// 		posts.reverse().forEach((post) => {
// 			prependPost(post, userMap);
// 		});
// 	}
// }

// // Función para agregar un nuevo post en la parte superior
// function prependPost(post, userMap) {
// 	const container = document.getElementById('data-container');
// 	const userName = userMap[post.userId] || 'Unknown User';

// 	const div = document.createElement('div');
// 	div.className = 'item';
// 	div.innerHTML = `
//         <strong>${userName}</strong>
//         <h4>${post.title}</h4>
//         <p>${post.body}</p>
//         <button onclick="deletePost(${post.id})">Delete</button>
//     `;

// 	// Insertar el nuevo post al inicio del contenedor
// 	container.insertBefore(div, container.firstChild);
// }
