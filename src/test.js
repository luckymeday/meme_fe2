db.rest.find({ $match: { $expr: {} } })

// 1. display all the documents in the collection restaurants.
db.rest.find().pretty()

// 2. display the fields restaurant_id, name, borough and cuisine for all the documents in the collection restaurant.
db.rest.find({}, { restaurant_id: 1, name: 1, borough: 1, cuisine: 1 }).pretty()

// 3. display the fields restaurant_id, name, borough and cuisine, but exclude the field _id for all the documents in the collection restaurant.
db.rest.find({}, { restaurant_id: 1, name: 1, borough: 1, cuisine: 1, _id: 0 }).pretty()

// 4. display the fields restaurant_id, name, borough and zip code, but exclude the field _id for all the documents in the collection restaurant.
db.rest.find({}, { restaurant_id: 1, name: 1, borough: 1, _id: 0, "address.zipcode": 1 }).pretty()

// 5. display all the restaurant which is in the borough Bronx.
db.rest.find({ borough: "Bronx" }).pretty()

// 6. display the first 5 restaurant which is in the borough Bronx.
db.rest.find({ borough: "Bronx" }).skip(5).pretty()

// 7. display the next 5 restaurants after skipping first 5 which are in the borough Bronx.
db.rest.find({ borough: "Bronx" }).skip(5).limit(5).pretty()

// 8. find the restaurants who achieved a score more than 90.
db.rest.aggregate(
    { $project: { restaurant_id: 1, name: 1, borough: 1, _id: 1, totalScore: { $sum: "$grades.score" } } },
    { $match: { "totalScore": { $gte: 90 } } }
).pretty()

// 9. find the restaurants that achieved a score, more than 80 but less than 100.
db.rest.aggregate(
    { $project: { restaurant_id: 1, name: 1, borough: 1, _id: 1, totalScore: { $sum: "$grades.score" } } },
    { $match: { "totalScore": { $gte: 80, $lte: 100 } } }
).pretty()


// ******************* ------------------ ******************* --------------------- *******************
// 10. find the restaurants which locate in latitude value less than -95.754168.
db.rest.find(
    { "address.coord.1": { $lte: -95.754168 } }, { _id: 0, restaurant_id: 1, name: 1, address: 1 }
).pretty()


// ******************* ------------------ ******************* --------------------- *******************
// 11. find the restaurants that do not prepare any cuisine of 'American' and their grade score more than 70 and latitude less than -65.754168.
db.rest.find(
    { $project: { restaurant_id: 1, name: 1, borough: 1, _id: 1, totalScore: { $sum: "$grades.score" } } },
    { $match: { "totalScore": { $gte: 70 }, cuisine: { $ne: "American " }, "address.coord.1": { $lte: 65.754168 } } }
).pretty()


// ******************* ------------------ ******************* --------------------- *******************
// 12. find the restaurants which do not prepare any cuisine of 'American' and achieved a score more than 70 and located in the longitude less than -65.754168.
// Note : Do this query without using $and operator.
db.rest.aggregate(
    { $project: { restaurant_id: 1, name: 1, borough: 1, _id: 1, totalScore: { $sum: "$grades.score" } } },
    { $match: { "totalScore": { $gte: 70 } } },
    { "address.coord.1": { $lte: -65.754168 }, cuisine: { $ne: "American " }, _id: 0, restaurant_id: 1, name: 1, address: 1 }
).pretty()

// 13. find the restaurants which do not prepare any cuisine of 'American ' and achieved a grade point 'A' not belongs to the borough Brooklyn. The document must be displayed according to the cuisine in descending order.
db.rest.find(
    { $and: [{ cuisine: { $ne: "American " } }, { "grades.grade": "A" }, { borough: { $ne: "Brooklyn" } }] },
    { _id: 0, name: 1, borough: 1, cuisine: 1 }
).sort({ cuisine: 1 }).pretty()

// 14. find the restaurant Id, name, borough and cuisine for those restaurants which contain 'Wil' as first three letters for its name.
db.rest.find(
    { name: { $regex: /^Wil.*/ } },
    { _id: 1, name: 1, borough: 1, cuisine: 1 }
).pretty()

// 15. find the restaurant Id, name, borough and cuisine for those restaurants which contain 'ces' as last three letters for its name.
db.rest.find(
    { name: { $regex: /ces$/ } },
    { _id: 1, name: 1, borough: 1, cuisine: 1 }
).pretty()

// 16. find the restaurant Id, name, borough and cuisine for those restaurants which contain 'Reg' as three letters somewhere in its name.
db.rest.find(
    { name: { $regex: /Reg/ } },
    { _id: 1, name: 1, borough: 1, cuisine: 1 }
).pretty()


// ******************* ------------------ ******************* --------------------- *******************
// 17. find the restaurants which belong to the borough Bronx and prepared either American or Chinese dish.
db.rest.find({
    $and: [
        { $or: [{ cuisine: { $in: "American " } }, { cuisine: { $in: "Chinese" } }] },
        { borough: "Bronx" }
    ]
}).pretty()

// 18. find the restaurant Id, name, borough and cuisine for those restaurants which belong to the borough Staten Island or Queens or Bronxor Brooklyn.
db.rest.find(
    { $or: [{ borough: "Staten Island" }, { borough: "Queens" }, { borough: "Bronx" }, { borough: "Brooklyn" }] },
    { restaurant_id: 1, name: 1, borough: 1, cuisine: 1 }
).pretty()

// 19. find the restaurant Id, name, borough and cuisine for those restaurants which are not belonging to the borough Staten Island or Queens or Bronx or Brooklyn.
db.rest.find(
    { $and: [{ borough: { $ne: "Staten Island" } }, { borough: { $ne: "Queens" } }, { borough: { $ne: "Bronx" } }, { borough: { $ne: "Brooklyn" } }] },
    { restaurant_id: 1, name: 1, borough: 1, cuisine: 1 }
).pretty()

// 20. find the restaurant Id, name, borough and cuisine for those restaurants which achieved a score which is not more than 10.
db.rest.aggregate(
    [
        { $project: { restaurant_id: 1, name: 1, borough: 1, cuisine: 1, totalScore: { $sum: "$grades.score" } } },
        { $match: { "totalScore": { $lte: 10 } } }
    ]
).pretty()

// 21. find the restaurant Id, name, borough and cuisine for those restaurants which prepared dish except 'American' and 'Chinese' or restaurant's name begins with letter 'Wil'.
db.rest.find({
    $or: [
        { $and: [{ cuisine: { $ne: "American " } }, { cuisine: { $ne: "Chinese" } }] },
        { name: { $regex: /^Wil/, $options: "m" } }
    ]
}).pretty()
// or
db.rest.find(
    {
        $or: [
            {
                cuisine: { $not: { $in: ["American ", "Chinese"] } }
            },
            {
                name: /^Wil/
            },
        ]
    }
).pretty()

// 22. find the restaurant Id, name, and grades for those restaurants which achieved a grade of "A" and scored 11 on an ISODate "2014-08-11T00:00:00Z" among many of survey dates..
db.rest.find(
    { "grades": { $elemMatch: { "date": ISODate("2014-08-11T00:00:00Z"), "grade": "A", "score": 11 } } },
    { _id: 0, restaurant_id: 1, name: 1, grades: 1 }
).pretty()

// 23. find the restaurant Id, name and grades for those restaurants where the 2nd element of grades array contains a grade of "A" and score 9 on an ISODate "2014-08-11T00:00:00Z".
db.rest.find(
    {
        $and: [{ "grades.1.grade": "A" }, { "grades.1.score": 9 }, { "grades.1.date": ISODate("2014-08-11T00:00:00Z") }]
    },
    { _id: 0, restaurant_id: 1, name: 1, grades: 1 }
).pretty()

// 24. find the restaurant Id, name, address and geographical location for those restaurants where 2nd element of coord array contains a value which is more than 42 and upto 52..
db.rest.find(
    { $and: [{ "address.coord.1": { $gt: 42 } }, { "address.coord.1": { $lte: 52 } }] }, { _id: 0, restaurant_id: 1, name: 1, address: 1 }
).pretty()

// 25. arrange the name of the restaurants in ascending order along with all the columns.
db.rest.find({}, { _id: 0, name: 1 }).sort({ name: 1 }).pretty()

// 26. arrange the name of the restaurants in descending along with all the columns.
db.rest.find({}, { _id: 0, name: 1 }).sort({ name: -1 }).pretty()

// 27. arranged the name of the cuisine in ascending order and for that same cuisine borough should be in descending order.
db.rest.find({}, { _id: 0, cuisine: 1, borough: 1 }).sort({ cuisine: 1, borough: -1 }).pretty()

// 28. know whether all the addresses contains the street or not.
//With Street:
db.rest.find(
    { "address.street": { $regex: /Street/ } }
).pretty()

// or Not with street:
db.rest.find({ "address.street": { $ne: { $regex: /Street/ } } }).pretty()

// 29. Write a MongoDB query which will select all documents in the restaurants collection where the coord field value is Double.
db.rest.find(
    { "address.coord": { $type: "double" } },
    { _id: 0, address: 1 }
).pretty()

// 30. Write a MongoDB query which will select the restaurant Id, name and grades for those restaurants which returns 0 as a remainder after dividing the score by 7.
db.rest.find(
    { "grades.score": { $mod: [7, 0] } },
    { _id: 0, restaurant_id: 1, name: 1, grades: 1 }
).pretty()

// 31. find the restaurant name, borough, longitude and attitude and cuisine for those restaurants which contains 'mon' as three letters somewhere in its name.
db.rest.find(
    { name: { $regex: /mon/ } },
    { _id: 0, name: 1, borough: 1, "address.coord": 1, cuisine: 1 }
).pretty()

// 32. find the restaurant name, borough, longitude and latitude and cuisine for those restaurants which contain 'Mad' as first three letters of its name.
db.rest.find(
    { name: { $regex: /^Mad.*/ } },
    { _id: 0, name: 1, borough: 1, "address.coord": 1, cuisine: 1 }
).pretty()
