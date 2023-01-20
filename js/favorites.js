import { GithubUser } from "./GithubUser.js"

class Favorites {
    constructor(favoritesTable) {
        this.favoritesTable = document.querySelector(favoritesTable)

        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem("@github-favorites")) || []
        
        // [
        //     {
        //         login: 'dipimentel',
        //         name: "Diego Pimentel",
        //         public_repos: '57',
        //         followers: '32'
        //     },
        //     {
        //         login: 'maykbrito',
        //         name: "Mayk Brito",
        //         public_repos: '78',
        //         followers: '1237'
        //     }
        // ]
        
    }

    delete(user) {
        const filteredEntries = this.entries.filter((entry) => {
            return entry.login.toUpperCase() !== user.login.toUpperCase()
        })

        this.entries = filteredEntries
        this.update()
        this.save()
    }

    async add(username) {
        try {

            const userExist = this.entries
            .find(entry => entry.login.toUpperCase() === username.toUpperCase())

            if (userExist) {
                throw new Error("Usuário já existe!")
            }

            const newUser = await GithubUser.search(username)

            if (newUser.login === undefined) {
                throw new Error("Usuário não encontrado!")
            }

            this.entries = [newUser, ...this.entries]

        } catch(error) {
            alert(error.message)
        }
        
        this.save()
        this.update()
    }

    save() {
        localStorage.setItem("@github-favorites", JSON.stringify(this.entries))
    }

}


export class FavoritesView extends Favorites {
    constructor(favoritesTable) {
        super(favoritesTable)

        this.update()
        this.onAdd()
    }

    onAdd() {
        const addButton = document.querySelector(".search button")
        const inputSearch = document.querySelector("#input-search")

        addButton.addEventListener("click", () => {
            const { value } = inputSearch
            this.add(value)
            inputSearch.value = ""
        })

        inputSearch.addEventListener("keypress", (e) => {
            if (e.key === 'Enter') {
                const { value } = inputSearch
                this.add(value)
                inputSearch.value = ""
            }
        })
        
    }

    update() {
        this.removeAllTr()
        
        const tbody = this.favoritesTable.querySelector("tbody")
        const isEmpty = this.entries.length === 0
        
        if (isEmpty) {
            const emptyRow = this.createEmptyRow()

            tbody.append(emptyRow)

        } else {

            this.entries.forEach((user) => {
                const row = this.createRow()

                row.querySelector(".user img").src = `https://github.com/${user.login}.png`
                row.querySelector(".user img").alt = `Foto de perfil de ${user.name}`
                row.querySelector(".user a").href = `https://github.com/${user.login}`
                row.querySelector(".user a p").innerHTML = user.name
                row.querySelector(".user a span").innerHTML = user.login
                row.querySelector(".repositories").innerHTML = user.public_repos
                row.querySelector(".followers").innerHTML = user.followers

                row.querySelector(".remove").onclick = () => {
                    const isOk = confirm("Deseja realmente excluir este usuário?")
                    if (isOk) {
                        this.delete(user)
                    }
                }

                tbody.append(row)
            })
        }

    }

    createRow() {
        const tr = document.createElement("tr")
        
        tr.innerHTML = 
            `
            <td class="user">
                <img height="56px" src="https://github.com/dipimentel.png" alt="Foto de perfil do Diego Pimentel">
                <a href="https://github.com/dipimentel" target="_blank">
                    <p>Diego Pimentel</p>
                    <span>/dipimentel</span>
                </a>
            </td>
            <td class="repositories">123</td>
            <td class="followers">123</td>
            <td>
                <button class="remove">Remover</button>
            </td>
            `
        return tr
    }

    createEmptyRow() {
        const tr = document.createElement('tr')

        tr.innerHTML =
        `
            <td colspan="4">
                <img src="/images/estrela.svg" alt="Desenho minimalista de uma estrela com olhos e boca aberta">
                <span>Nenhum favorito ainda</span>
            </td>
        `
        tr.classList.add('emptyFavorites')

        return tr
    }

    removeAllTr() {
        this.favoritesTable.querySelectorAll("tr")
        .forEach((tr) => tr.remove())
    }
}  