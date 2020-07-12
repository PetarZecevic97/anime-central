# 12-AnimeCentral

> AnimeCentral je mesto gde korisnici mogu da istražuju informacije vezane za anime.
> To podrazumeva informisanje o žanru kom anime pripada, o datumu početka prikazivanja,
> o studiju izdavanja itd. Moguće je ocenjivanje animea, dodavanje u Wish listu, 
> Watched listu, kao i njihovo komentarisanje. Moguće je čitati tuđe komentare i 
> videti prosečnu ocenu koju su korisnici izglasali. 

**Tehnički detalji**

Baza je relacionog tipa i rađena je u MySQLWorkbenchu. Za serversku stranu korišćeni
su Redis server i Node.js. Za klijentsku stranu korišćen je Angular9.

**Način pokretanja**

    1. Potrebno je preuzeti ceo projekat!
2. Nakon toga potrebno je učitati skript sa putanje `./database/anime_central_db.sql` u servis MySQLWorkbench i pokrenuti ga, čime će se napraviti relaciona baza podataka sa odgovarajućim podacima.
3. U fajlu na putanji `./server/global.js` potrebno je izmeniti informacije za username i password korisnika koji pravi bazu podataka
3. Za potrebe serverske strane neophodno je instalirati Redis i pokrenuti ga da radi u pozadini
4. Pozicionirati se u direktorijum `./server` i u njemu izvršiti komande `npm install` i `node index.js`
5. Pozicionirati se u direktorijum `./Client` i u njemu izvršiti komande `npm install` i `ng serve`
6. Pokrenuti aplikaciju na `http://localhost:4200`

Demo video se može pogledati na adresi: https://youtu.be/4ZbHEmFDY6I

*Pozadina na početnoj stranici je preuzeta sa: https://wall.alphacoders.com/big.php?i=205913*

## Članovi tima

- [Anđelka Milovanović, 145/2015](https://gitlab.com/mandja96)
- [Aleksandar Ranković, 111/2016](https://gitlab.com/Lexxigar)
- [Petar Zečević, 169/2016](https://gitlab.com/PetarZecevic)
- [Aleksandra Ružić, 47/2016](https://gitlab.com/AleksandraRuzic)
- [Nikola Perić, 330/2016](https://gitlab.com/backspacer303)
