const { Given, When, Then, setWorldConstructor, Before, After } = require('@cucumber/cucumber');
var assert = require('chai').assert
const { aanschrijfwijze, aanhef, gebruikInLopendeTekst } = require('./aanschrijfwijze');

var persoon = { partners: [] };
var actual = {};

const propertyNameMap = new Map([
    ['geslachtsaanduiding (04.10)', 'geslacht.code'],
    
    // Naam
    ['voornamen (02.10)', 'naam.voornamen'],
    ['adellijke titel of predicaat (02.20)', 'naam.adellijkeTitelPredicaat.code'],
    ['voorvoegsel (02.30)', 'naam.voorvoegsel'],
    ['geslachtsnaam (02.40)', 'naam.geslachtsnaam'],
    ['aanduiding naamgebruik (61.10)', 'naam.aanduidingNaamgebruik.code'],

    // Partner
    ['datum huwelijkssluiting/aangaan geregistreerd partnerschap (06.10)', 'aangaanHuwelijkPartnerschap.datum'],
    ['datum ontbinding huwelijk/geregistreerd partnerschap (07.10)', 'ontbindingHuwelijkPartnerschap.datum'],

]);

const groupNameMap = new Map([
    ['partner', 'partners'],
    ['ex-partner', 'partners']
])

function mapRowToProperty(obj, row) {
    let propertyName = propertyNameMap.get(row.naam);
    if(propertyName === undefined) {
        propertyName = row.naam;
    }

    setProperty(obj, propertyName, row.waarde);
}

function setProperty(obj, propertyName, propertyValue) {
    if(propertyValue === undefined || propertyValue === '') {
        return;
    }

    if(propertyName.includes('.')) {
        let propertyNames = propertyName.split('.');
        let property = obj;

        propertyNames.forEach(function(propName, index) {
            if(index === propertyNames.length-1) {
                property[propName] = propertyValue;
            }
            else {
                if(property[propName] === undefined) {
                    property[propName] = {};
                }
                property = property[propName];
            }
        });
    }
    else {
        obj[propertyName] = propertyValue;
    }
}

function createPersonFrom(dataTable) {
    let obj = {
        naam: {
            geslachtsnaam: '.'
        },
        geslacht: { code: 'O' },
        partners: []
    };

    return createObjectFrom(dataTable, obj);
}

function createObjectFrom(dataTable, obj = {}) {
    dataTable.hashes().forEach(function(row) {
        mapRowToProperty(obj, row);
    });

    return obj;
}

Given('landelijke tabel {string} heeft de volgende waarden', function (string, dataTable) {
    return true;
});

Given('de persoon met burgerservicenummer {string} heeft de volgende gegevens', function (bsn, dataTable) {
    persoon = createPersonFrom(dataTable);
});

Given('de persoon heeft nooit een actueel of ontbonden huwelijk of partnerschap gehad', function () {
    persoon.partners = []
});

Given('de persoon heeft geen \\(ex)partner', function () {
    persoon.partners = []
  });

Given('de persoon heeft geen actuele partner', function () {
    persoon.partners = []
});

Given('de persoon heeft een {string} met de volgende gegevens', function (rel, dataTable) {
    persoon[groupNameMap.get(rel)].push(createObjectFrom(dataTable));
});

Given('de {string} is gewijzigd naar de volgende gegevens', function (rel, dataTable) {
    i = persoon[groupNameMap.get(rel)].length - 1;
    persoon[groupNameMap.get(rel)][i] = createObjectFrom(dataTable, persoon[groupNameMap.get(rel)][i]);
  });

When('personen wordt gezocht met de volgende parameters', function (dataTable) {
    //console.log(persoon);
    //console.log(persoon.partners[0]);
    actual.adressering = {};

    if (dataTable.rowsHash().fields.includes('aanschrijfwijze')) {
        if (aanschrijfwijze(persoon) !== null) {
            actual.adressering.aanschrijfwijze = aanschrijfwijze(persoon);
        }
    }

    if (dataTable.rowsHash().fields.includes('aanhef')) {
        if (aanhef(persoon) !== null) {
            actual.adressering.aanhef = aanhef(persoon);
        }
    }
    
    if (dataTable.rowsHash().fields.includes('gebruikInLopendeTekst')) {
        if (gebruikInLopendeTekst(persoon) !== null) {
            actual.adressering.gebruikInLopendeTekst = gebruikInLopendeTekst(persoon);
        }
    }
});

Then(/^heeft de response een persoon met ?(?:alleen)? de volgende '(.*)' gegevens$/, function (groep, dataTable) {
    expected = {};
    expected[groep] = createObjectFrom(dataTable);
    //console.log(expected);
    //console.log(actual);

    assert.deepEqual(actual, expected);
});

Then('heeft de response een persoon zonder {string} gegevens', function (groep) {
    expected = {};
    expected[groep] = {};

    assert.deepEqual(actual, expected);
  });

  Then('heeft de response een persoon met een leeg {string} object', function (groep) {
    expected = {};
    expected[groep] = {};

    assert.deepEqual(actual, expected);
  });