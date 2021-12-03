// // const person = {
// //   name: "John",
// //   age: 30,
// //   greet() {
// //     console.log("Hi, I am " + this.name + "!");
// //   },
// // };

// // person.greet();

// // const array = ["xamidullox", "aazizbek", "humoyun", "salom"];

// // for (const key in array) {
// //   if (Object.hasOwnProperty.call(array, key)) {
// //     const element = array[key];
// //     console.log({ element, key });
// //   }
// // }

// // for (const iterator of array) {
// //   console.log(iterator);
// // }

// // const mapIteam = array.map((item) => {
// //   return item == "salom";
// // });

// // console.log({ mapIteam });

// // const people = ["xamidullo", "shaxzod", "nurbek"];

// // const [google, ...fack] = people;

// // console.table({
// //   google,
// //   fack,
// //   people,
// // });
// const fetchData = () => {
//   const promise = new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve("Done");
//     }, 1500);
//   });
//   return promise;
// };
// setTimeout(() => {
//   console.log("Timer is done!");

//   fetchData()
//     .then((text) => {
//       console.log(text);
//       return fetchData();
//     })
//     .then((text2) => {
//       console.log(text2);
//     });
// }, 2000);

// console.log("Hello !");
// console.log("Hi !");
