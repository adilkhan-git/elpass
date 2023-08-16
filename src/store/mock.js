import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axios);

const cards = [
  {
    id: 1,
    firstName: "Иван",
    lastName: "Петров",
    iin: "791225758965",
    phoneNumber: "+77478889977",
    company: "ООО Road Construction",
    position: "Менеджер",
    type: "Многоразовый",
    lastLogin: "2023-05-31",
    photoUrl: "https://picsum.photos/151",
  },
  {
    id: 2,
    firstName: "Анна",
    lastName: "Иванова",
    iin: "987654321098",
    phoneNumber: "+79876543210",
    company: "АО Kcell",
    position: "Разработчик",
    type: "Многоразовый",
    lastLogin: "2023-06-02",
    photoUrl: "https://picsum.photos/152",
  },
  {
    id: 3,
    firstName: "Мария",
    lastName: "Сидорова",
    iin: "456789012345",
    phoneNumber: "+74567890123",
    company: "ИП Семакина",
    position: "Бухгалтер",
    type: "Временный",
    lastLogin: "2023-06-04",
    photoUrl: "https://picsum.photos/153",
  },
  {
    id: 4,
    firstName: "Инна",
    lastName: "Федорова",
    iin: "1234567890",
    phoneNumber: "+74567890123",
    company: "ИП Алишер",
    position: "Финансист",
    type: "Временный",
    lastLogin: "2023-06-05",
    photoUrl: "https://picsum.photos/154",
  },
];

const visits = [
  {
    id: 1,
    dateTime: "2023-07-01 10:00",
    visitorId: 1,
    visitorName: "Иван Петров",
    companyName: "ООО Road Construction",
    entrance: "Entrance1",
    direction: "Внутрь",
    similarity: 80,
  },
  {
    id: 2,
    dateTime: "2023-07-02 15:30",
    visitorId: 2,
    visitorName: "Анна Иванова",
    companyName: "АО Kcell",
    entrance: "Entrance1",
    direction: "Наружу",
    similarity: 95,
  },
  {
    id: 3,
    dateTime: "2023-07-03 14:15",
    visitorId: 3,
    visitorName: "Мария Сидорова",
    companyName: "ИП Семакина",
    entrance: "Entrance1",
    direction: "Внутрь",
    similarity: 85,
  },
];
const users = [
  {
    id: 1,
    email: "admin@gmail.com",
    password: "admin",
    role: "admin",
    firstName: "Adilkhan",
    lastName: "Zamanbek",
    position: "CEO",
    phoneNumber: "+77472229800",
  },
  {
    id: 2,
    email: "operator@gmail.com",
    password: "operator",
    role: "operator",
    firstName: "Nursultan",
    lastName: "Nazarbayev",
    position: "Operator",
    phoneNumber: "+77777777777",
  },
  {
    id: 3,
    email: "employee@gmail.com",
    password: "employee",
    role: "employee",
    firstName: "Dmitry",
    lastName: "Balandin",
    position: "Employee",
    phoneNumber: "+78888888888",
  },
];

const lists = [
  {
    id: 1,
    name: "Список 1",
    date: "2023-08-10",
  },
  {
    id: 2,
    name: "Список 2",
    date: "2023-08-05",
  },
  {
    id: 3,
    name: "Список 3",
    date: "2023-08-05",
  },
  {
    id: 4,
    name: "Список 4",
    date: "2023-08-05",
  },
];

const terminals = [
  {
    id: 1,
    name: "Терминал 1",
    url: "http://192.168.0.178",
    type: "In",
    status: "Online",
  },
  {
    id: 2,
    name: "Терминал 2",
    url: "http://192.168.0.188",
    type: "Out",
    status: "Online",
  },
];

mock.onGet("/terminals").reply(() => {
  console.log("fetched all terminals");
  return [200, terminals];
});

mock.onPost("/terminals").reply((config) => {
  const newTerminal = JSON.parse(config.data);
  const maxId = Math.max(...terminals.map((terminal) => terminal.id));
  newTerminal.id = maxId + 1;

  terminals.push(newTerminal);

  console.log("Added new terminal with ID:", newTerminal.id);
  return [200, newTerminal];
});

mock.onDelete(/\/terminals\/\d+/).reply((config) => {
  const id = parseInt(config.url.split("/").pop());
  const index = terminals.findIndex((terminal) => terminal.id === id);
  if (index !== -1) {
    terminals.splice(index, 1);
    console.log("Deleted terminal with ID:", id);
    return [200];
  } else {
    return [404, { message: "Terminal not found" }];
  }
});
mock.onPut(/\/terminals\/\d+/).reply((config) => {
  const updatedTerminal = JSON.parse(config.data);
  const index = terminals.findIndex(
    (terminal) => terminal.id === updatedTerminal.id
  );
  if (index !== -1) {
    terminals[index] = updatedTerminal;
    console.log("Updated terminal with ID:", updatedTerminal.id);
    return [200, updatedTerminal];
  } else {
    return [404, { message: "Terminal not found" }];
  }
});

mock.onGet("/lists").reply(() => {
  console.log("fetched all lists");
  return [200, lists];
});

mock.onDelete(/\/lists\/\d+/).reply((config) => {
  const id = parseInt(config.url.split("/").pop());
  const index = lists.findIndex((list) => list.id === id);
  if (index !== -1) {
    lists.splice(index, 1);
    console.log("Deleted list with ID:", id);
    return [200];
  } else {
    return [404, { message: "List not found" }];
  }
});

mock.onGet("/users").reply(() => {
  console.log("Fetching all users");
  return [200, users];
});

mock.onPost("/users").reply((config) => {
  const newUser = JSON.parse(config.data);
  const newId = Math.max(...users.map((u) => u.id)) + 1;
  newUser.id = newId;

  users.push(newUser);
  console.log("Added new user:", newUser);

  return [201, newUser];
});

mock.onPut(/\/users\/\d+/).reply((config) => {
  const updatedUser = JSON.parse(config.data);
  const index = users.findIndex((user) => user.id === updatedUser.id);

  if (index !== -1) {
    users[index] = updatedUser;
    console.log("Updated user:", updatedUser);
    return [200, updatedUser];
  } else {
    console.error("User not found for updating:", updatedUser.id);
    return [404, { message: "User not found" }];
  }
});

mock.onDelete(/\/users\/\d+/).reply((config) => {
  const userId = parseInt(config.url.split("/").pop());
  const index = users.findIndex((u) => u.id === userId);

  if (index !== -1) {
    users.splice(index, 1);
    console.log("Deleted user with ID:", userId);
    return [200];
  } else {
    console.error("User not found for deletion:", userId);
    return [404, { message: "User not found" }];
  }
});

mock.onPost("/upload-photo").reply((config) => {
  const formData = config.data;
  const uploadedFile = formData.get("file");

  const uploadedImageURL = URL.createObjectURL(uploadedFile);

  return [200, { photoUrl: uploadedImageURL }];
});

mock.onGet("/cards").reply(200, cards);

mock.onPost("/cards").reply((config) => {
  const newCard = JSON.parse(config.data);
  const cardId = cards.length + 1;
  newCard.id = cardId;
  newCard.photoUrl = "";
  console.log(cards);
  cards.push(newCard);
  console.log("pushed");
  return [201, newCard];
});
mock.onPut(/\/cards\/\d+/).reply((config) => {
  const updatedCard = JSON.parse(config.data);
  const cardIndex = cards.findIndex((card) => card.id === updatedCard.id);
  if (cardIndex !== -1) {
    cards[cardIndex] = updatedCard;
    console.log("Card is updated");
    return [200, updatedCard];
  } else {
    return [404, { message: "Card not found" }];
  }
});
mock.onDelete(/\/cards\/(\d+)/).reply((config) => {
  const id = parseInt(config.url.match(/\/cards\/(\d+)/)[1]);
  const index = cards.findIndex((card) => card.id === id);
  if (index !== -1) {
    cards.splice(index, 1);
    return [200];
  } else {
    return [404, { message: "Card not found" }];
  }
});

mock.onPost("/login").reply((config) => {
  const { email, password } = JSON.parse(config.data);
  const user = users.find(
    (user) => user.email === email && user.password === password
  );

  if (user) {
    return [
      200,
      {
        user: {
          id: user.id,
          role: user.role,
          email: user.email,
          firstName: user.firstName,
        },
        token: "fake-jwt-token",
      },
    ];
  } else {
    return [400, { message: "Email or password is incorrect" }];
  }
});
mock.onGet("/visits").reply(200, visits);

export default mock;
