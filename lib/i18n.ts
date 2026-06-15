export type Lang = "es" | "en";

type Dict = Record<string, { es: string; en: string }>;

export const T: Dict = {
  // Nav / general
  menu: { es: "Menú", en: "Menu" },
  spaces: { es: "Espacios", en: "Spaces" },
  reserve: { es: "Reservar", en: "Reserve" },
  order: { es: "Ordenar", en: "Order" },
  login: { es: "Iniciar sesión", en: "Log in" },
  logout: { es: "Cerrar sesión", en: "Log out" },
  register: { es: "Crear cuenta", en: "Sign up" },
  back: { es: "Volver", en: "Back" },
  cancel: { es: "Cancelar", en: "Cancel" },
  confirm: { es: "Confirmar", en: "Confirm" },
  save: { es: "Guardar", en: "Save" },
  loading: { es: "Cargando…", en: "Loading…" },
  total: { es: "Total", en: "Total" },
  myAccount: { es: "Mi cuenta", en: "My account" },

  // Landing hero
  heroEyebrow: { es: "Café de especialidad · Tueste propio", en: "Specialty coffee · House roasted" },
  heroTitle: { es: "Tu momento Kai, en cada taza", en: "Your Kai moment, in every cup" },
  heroSub: {
    es: "Grano selecto, espacios para crear y un programa de lealtad que premia cada visita.",
    en: "Selected beans, spaces to create, and a loyalty program that rewards every visit.",
  },
  heroCtaMenu: { es: "Ver el menú", en: "See the menu" },
  heroCtaReserve: { es: "Reservar un espacio", en: "Reserve a space" },
  exploreNoLogin: { es: "Explora sin registrarte", en: "Browse without signing up" },

  // Menu section
  menuTitle: { es: "Nuestro menú", en: "Our menu" },
  menuSub: { es: "Café, grano para llevar y comida fresca cada día.", en: "Coffee, beans to go and fresh food daily." },
  tabCafe: { es: "Café", en: "Coffee" },
  tabGrano: { es: "Grano", en: "Beans" },
  tabComida: { es: "Comida", en: "Food" },
  add: { es: "Agregar", en: "Add" },

  // Spaces section
  spacesTitle: { es: "Espacios para tu momento", en: "Spaces for your moment" },
  spacesSub: { es: "Salones privados y patios al aire libre. Reserva por hora.", en: "Private rooms and open-air patios. Book by the hour." },
  capacity: { es: "Capacidad", en: "Capacity" },
  people: { es: "personas", en: "people" },
  perHour: { es: "/hora", en: "/hour" },
  available: { es: "Disponible", en: "Available" },

  // Method / value
  why: { es: "Por qué Kai", en: "Why Kai" },
  whySub: { es: "Hecho con cuidado, de la finca a tu taza.", en: "Made with care, from farm to cup." },
  val1t: { es: "Tueste propio", en: "House roast" },
  val1d: { es: "Tostamos cada lote en casa, fresco cada semana.", en: "We roast every batch in house, fresh weekly." },
  val2t: { es: "Origen trazable", en: "Traceable origin" },
  val2d: { es: "Single origin de Chiapas, Veracruz y Oaxaca.", en: "Single origin from Chiapas, Veracruz and Oaxaca." },
  val3t: { es: "Lealtad real", en: "Real loyalty" },
  val3d: { es: "Acumula puntos en cada visita y sube de nivel.", en: "Earn points on every visit and level up." },
  val4t: { es: "Espacios para crear", en: "Spaces to create" },
  val4d: { es: "Wifi, enchufes y silencio para tu mejor trabajo.", en: "Wifi, outlets and quiet for your best work." },

  ctaBannerT: { es: "Crea tu cuenta y empieza a sumar puntos", en: "Create your account and start earning points" },
  ctaBannerD: { es: "Pide en segundos, reserva espacios y sube de nivel.", en: "Order in seconds, book spaces and level up." },

  // Auth
  createAccount: { es: "Crea tu cuenta Kai", en: "Create your Kai account" },
  welcomeBack: { es: "Bienvenido de vuelta", en: "Welcome back" },
  name: { es: "Nombre completo", en: "Full name" },
  phone: { es: "Teléfono", en: "Phone" },
  email: { es: "Correo", en: "Email" },
  password: { es: "Contraseña", en: "Password" },
  noAccount: { es: "¿No tienes cuenta?", en: "No account?" },
  haveAccount: { es: "¿Ya tienes cuenta?", en: "Already have an account?" },
  signupCta: { es: "Registrarme", en: "Sign up" },
  loginCta: { es: "Entrar", en: "Log in" },

  // App cliente
  hello: { es: "Hola", en: "Hi" },
  points: { es: "Puntos", en: "Points" },
  level: { es: "Nivel", en: "Level" },
  toNext: { es: "para el siguiente nivel", en: "to the next level" },
  home: { es: "Inicio", en: "Home" },
  history: { es: "Historial", en: "History" },
  profile: { es: "Perfil", en: "Profile" },
  newOrder: { es: "Nuevo pedido", en: "New order" },
  newReservation: { es: "Nueva reserva", en: "New reservation" },
  myOrders: { es: "Mis pedidos", en: "My orders" },
  myReservations: { es: "Mis reservas", en: "My reservations" },
  cart: { es: "Carrito", en: "Cart" },
  placeOrder: { es: "Hacer pedido", en: "Place order" },
  emptyCart: { es: "Tu carrito está vacío", en: "Your cart is empty" },
  noOrders: { es: "Aún no tienes pedidos", en: "No orders yet" },
  noReservations: { es: "Aún no tienes reservas", en: "No reservations yet" },
  date: { es: "Fecha", en: "Date" },
  time: { es: "Hora", en: "Time" },
  hours: { es: "Horas", en: "Hours" },
  space: { es: "Espacio", en: "Space" },
  confirmReservation: { es: "Confirmar reserva", en: "Confirm reservation" },
  orderPlaced: { es: "¡Pedido realizado!", en: "Order placed!" },
  reservationPlaced: { es: "¡Reserva creada!", en: "Reservation created!" },
  earnedPoints: { es: "Ganaste", en: "You earned" },
  pts: { es: "pts", en: "pts" },
  goToApp: { es: "Ir a mi panel", en: "Go to my dashboard" },
  editProfile: { es: "Editar perfil", en: "Edit profile" },

  // Estados
  pendiente: { es: "Pendiente", en: "Pending" },
  confirmada: { es: "Confirmada", en: "Confirmed" },
  cancelada: { es: "Cancelada", en: "Cancelled" },
  lista: { es: "Lista", en: "Ready" },
  entregado: { es: "Entregado", en: "Delivered" },

  // Admin
  adminPanel: { es: "Panel Kai", en: "Kai Panel" },
  adminLogin: { es: "Acceso administrador", en: "Admin access" },
  adminPass: { es: "Contraseña de admin", en: "Admin password" },
  enter: { es: "Entrar", en: "Enter" },
  revenue: { es: "Ingresos", en: "Revenue" },
  activeReservations: { es: "Reservas activas", en: "Active reservations" },
  ordersToday: { es: "Pedidos hoy", en: "Orders today" },
  totalClients: { es: "Clientes", en: "Clients" },
  manageReservations: { es: "Reservaciones", en: "Reservations" },
  clients: { es: "Clientes", en: "Clients" },
  manageMenu: { es: "Menú", en: "Menu" },
  dashboard: { es: "Resumen", en: "Overview" },
  confirmAction: { es: "Confirmar", en: "Confirm" },
  cancelAction: { es: "Cancelar", en: "Cancel" },
  addItem: { es: "Agregar item", en: "Add item" },
  active: { es: "Activo", en: "Active" },
  inactive: { es: "Inactivo", en: "Inactive" },
  visits: { es: "Visitas", en: "Visits" },
  wrongPassword: { es: "Contraseña incorrecta", en: "Wrong password" },

  // Errores
  errGeneric: { es: "Algo salió mal. Intenta de nuevo.", en: "Something went wrong. Try again." },
  errEmailUsed: { es: "Ese correo ya está registrado.", en: "That email is already registered." },
  errBadLogin: { es: "Correo o contraseña incorrectos.", en: "Wrong email or password." },
  errFields: { es: "Completa todos los campos.", en: "Fill in all fields." },
};

export function tr(key: string, lang: Lang): string {
  const e = T[key];
  if (!e) return key;
  return e[lang] || e.es;
}
