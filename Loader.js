class Loader {

    async loadMap() {
        const data = await fetch("http://localhost:3000/api/map", {
            method: "GET"
        });
        const dataJson = await data.json();
        return dataJson.map;
    }
}