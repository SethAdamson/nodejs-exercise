const axios = require('axios')

async function getAll(api) {
    const resArr = []
    async function callApi(api) {
        const resp = await axios.get(api);
        const { next, results } = resp.data;
        results.forEach(e => resArr.push(e));
        if (!next) {
            return;
        }
        await callApi(next);
    }
    await callApi(api);
    return resArr;
}

module.exports = {
    getPeople: async (req, res) => {
        let peopleArr = await getAll('https://swapi.co/api/people');

        let { sortBy } = req.query;
        console.log(sortBy, typeof sortBy);
        const queryOptions = ['name', 'height', 'mass'];

        if (sortBy && queryOptions.includes(sortBy.toLowerCase())) {
            sortBy = sortBy.toLowerCase();
            if (sortBy === 'name') {
                peopleArr = peopleArr.sort((a, b) => {
                    if (a[sortBy] < b[sortBy]) 
                        return -1 
                    if (a[sortBy] > b[sortBy])
                        return 1
                    return 0
                });
            } else {
                peopleArr = peopleArr.sort((a, b) => a[sortBy] - b[sortBy]);
            }
        }

        res.status(200).send(peopleArr);

    },

    getPlanets: async (req, res) => {
        const planetArr = await getAll('https://swapi.co/api/planets');
        let peopleArr = await getAll('https://swapi.co/api/people');

        const finalMap = planetArr.map(planet => {
            let { residents } = planet;
            const newRes = residents.map(person => {
                return peopleArr.find(e => e.url === person).name;
            })
            planet.residents = newRes;
            return planet;
        });

        res.status(200).send(finalMap);
        
    },

    getPlanets2: async (req, res) => {
        const planetArr = await getAll('https://swapi.co/api/planets');

        for (let i = 0; i < planetArr.length; i++){
            const planet = planetArr[i];
            const { residents } = planet
            const newRes = [];
            for (let k = 0; k < residents.length; k++) {
                const personUrl = residents[k];
                const result = await axios.get(personUrl);
                newRes.push(result.data.name);
            }
            planet.residents = newRes;
        }

        res.status(200).send(planetArr);

    },}