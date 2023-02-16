function predicaat (persoon) {
	if (persoon.naam.adellijkeTitelPredicaat == undefined) { return "" }
	
	if (gebruikPredicaat(persoon) === false) { return "" }
	
	switch (persoon.naam.adellijkeTitelPredicaat.code + '-' + persoon.geslacht.code) {
		case "JH-M": return "jonkheer"
		case "JH-V": return "jonkvrouw"
		case "JV-M": return "jonkheer"
		case "JV-V": return "jonkvrouw"
		default: return "";
	}
}

function gebruikPredicaat(persoon) {
	if (persoon.naam.aanduidingNaamgebruik.code == 'P') { return false }
	if (persoon.geslacht.code !== 'V') { return true }
	if (persoon.partners.length == 0) { return true }
	if (persoon.partners[0].ontbindingHuwelijkPartnerschap == undefined) { return false }
	if (persoon.naam.aanduidingNaamgebruik.code == 'E') { return true }
	
	return false;
}

function titel(naam, geslacht) {
	if (naam.adellijkeTitelPredicaat == undefined) { return "" }
	
	switch (naam.adellijkeTitelPredicaat.code + '-' + geslacht.code) {
		case "R-M": return "ridder"
		case "B-M": return "baron"
		case "B-V": return "barones"
		case "BS-M": return "baron"
		case "BS-V": return "barones"
		case "H-M": return "hertog"
		case "H-V": return "hertogin"
		case "HI-M": return "hertog"
		case "HI-V": return "hertogin"
		case "G-M": return "graaf"
		case "G-V": return "gravin"
		case "GI-M": return "graaf"
		case "GI-V": return "gravin"
		case "M-M": return "markies"
		case "M-V": return "markiezin"
		case "MI-M": return "markies"
		case "MI-V": return "markiezin"
		case "P-M": return "prins"
		case "P-V": return "prinses"
		case "PS-M": return "prins"
		case "PS-V": return "prinses"
		default: return "";
	}
}
 
function aanspreekvorm(naam, geslacht) {
	if (naam.adellijkeTitelPredicaat == undefined) { return null }

	if (naam.adellijkeTitelPredicaat.code == 'P' || naam.adellijkeTitelPredicaat.code == 'PS') {
		return "De hoogheid";
	}

	if (naam.adellijkeTitelPredicaat.code == 'G' || naam.adellijkeTitelPredicaat.code == 'GI') {
		switch (geslacht.code) {
			case 'M': return "De hooggeboren heer";
			case 'V': return "De hooggeboren vrouwe";
			default: return null;
		}
	}

	if (naam.adellijkeTitelPredicaat.code == 'R') {
		if (geslacht.code == 'M') {
			return "De hoogwelgeboren heer";
		} else {
			return null;
		}
	}

	switch (geslacht.code) {
		case 'M': return "De hoogwelgeboren heer";
		case 'V': return "De hoogwelgeboren vrouwe";
		default: return null;
	}
}

function aanhefAdellijk(naam, geslacht) {
	if (naam.adellijkeTitelPredicaat == undefined) { return null }

	if (naam.adellijkeTitelPredicaat.code == 'P' || naam.adellijkeTitelPredicaat.code == 'PS') {
		return "Hoogheid";
	}

	if (naam.adellijkeTitelPredicaat.code == 'G' || naam.adellijkeTitelPredicaat.code == 'GI') {
		switch (geslacht.code) {
			case 'M': return "Hooggeboren heer";
			case 'V': return "Hooggeboren vrouwe";
			default: return null;
		}
	}

	switch (geslacht.code) {
		case 'M': return "Hoogwelgeboren heer";
		case 'V': return "Hoogwelgeboren vrouwe";
		default: return null;
	}
}

function voornaamNaarVoorletter (voornaam) {
	switch (voornaam.length) {
		case 0: return '';
		case 1: return voornaam + ' ';
		default: return voornaam[0] + '.';
	}
}

function voorletters (naam) {
	if (naam.voornamen == undefined) { return '' }
	
	voornamen = naam.voornamen.split(' ')
	return voornamen.map(voornaamNaarVoorletter).join('');
}

function voorvoegsel (naam) {
	if (naam.voorvoegsel == undefined) { return '' }
	
	return naam.voorvoegsel;
}

function geslachtsnaam (naam) {
	if (naam.geslachtsnaam == undefined) {
	if (naam.geslachtsnaam == '.') { return '' }}
	
	return naam.geslachtsnaam;
}

function aanhefAanspreekvorm (persoon) {
	switch (persoon.geslacht.code) {
		case 'M': return 'Geachte heer';
		case 'V': return 'Geachte mevrouw';
		default: return '';
	}
}

function lopendeTekstAanspreekvorm (persoon) {
	switch (persoon.geslacht.code) {
		case 'M': return 'de heer';
		case 'V': return 'mevrouw';
		default: return voorletters(persoon.naam);
	}
}

function gebruikHoffelijkheidstitel (persoon) {
	if (persoon.geslacht.code !=='V') { return false }
	if (persoon.naam.aanduidingNaamgebruik.code == 'E') { return false }
	if (persoon.partners.length == 0) { return false }
	if (persoon.partners[0] == undefined) { return false }
	if (persoon.partners[0].naam == undefined) { return false }
	if (persoon.partners[0].naam.adellijkeTitelPredicaat == undefined) { return false }
	if ( ['B', 'G', 'H', 'M', 'P'].includes(persoon.partners[0].naam.adellijkeTitelPredicaat.code)) { return true }
	
	return false;	
}

function gebruikAdellijkeAanspreekvorm (persoon) {
	if (persoon.naam.aanduidingNaamgebruik.code == 'P') { return false }
	if (persoon.naam.adellijkeTitelPredicaat == undefined) { return false }
	if ( ['JV', 'JH'].includes(persoon.naam.adellijkeTitelPredicaat.code) && gebruikPredicaat(persoon) == false) { return false }

	return true;
}

function oudsteRelatie(a, b) {
	if (a.aangaanHuwelijkPartnerschap.datum < b.aangaanHuwelijkPartnerschap.datum) {
		return -1;
	}

	if (a.aangaanHuwelijkPartnerschap.datum > b.aangaanHuwelijkPartnerschap.datum) {
		return 1;
	}

	return 0;
}

function naamgebruikPartner(partners) {
	return partners.sort(oudsteRelatie)[0];
}

function opschonen(tekst) {
	tekst = tekst.replaceAll('  ', ' ');
	tekst = tekst.replaceAll('  ', ' ');
	tekst = tekst.replaceAll(' -', '-');
	tekst = tekst.replaceAll('- ', '-');
	tekst = tekst.trim();
	
	return tekst;
}

function capitalize (tekst) {
	return tekst.charAt(0).toUpperCase() + tekst.slice(1);
}

function geldigeNaam(persoon) {
	if (persoon.naam == undefined) { return false }
	if (persoon.naam.aanduidingNaamgebruik == undefined) { return false }

	if (persoon.naam.aanduidingNaamgebruik.code !== 'P') {
		if (persoon.naam.geslachtsnaam == undefined) { return false }
		if (persoon.naam.geslachtsnaam == '') { return false }
		if (persoon.naam.geslachtsnaam == '.') { return false }
	}

	return true;
}

function geldigePartnernaam (persoon) {
	if (persoon.partners == undefined) { return false }
	if (persoon.partners[0] == undefined) { return false }
	if (persoon.partners[0].naam == undefined) { return false }
	if (persoon.partners[0].naam.geslachtsnaam == undefined) { return false }
	if (persoon.partners[0].naam.geslachtsnaam == '') { return false }
	if (persoon.partners[0].naam.geslachtsnaam == '.') { return false }
}

function aanschrijfwijzeNaam (persoon) {
	let pk = predicaat(persoon);
	let vl = voorletters(persoon.naam);
	let at = titel(persoon.naam, persoon.geslacht);
	let vv = voorvoegsel(persoon.naam);
	let gn = geslachtsnaam(persoon.naam);
	let ht = '';
	let vp = '';
	let gp = '';
	
	if (persoon.partners.length > 0) {
		vp = voorvoegsel(persoon.partners[0].naam);
		gp = geslachtsnaam(persoon.partners[0].naam);
	}
	
	if (gebruikHoffelijkheidstitel(persoon)) {
		ht = titel(persoon.partners[0].naam, persoon.geslacht);
	}
	
	let aanschrijfwijze = '';
	switch (persoon.naam.aanduidingNaamgebruik.code) {
		case 'E': aanschrijfwijze = `${pk} ${vl} ${at} ${vv} ${gn}`; break;
		case 'V': aanschrijfwijze = `${vl} ${ht} ${vp} ${gp}-${pk}${at} ${vv} ${gn}`; break;
		case 'N': aanschrijfwijze = `${pk} ${vl} ${at} ${vv} ${gn}-${ht} ${vp} ${gp}`; break;
		case 'P': aanschrijfwijze = `${vl} ${ht} ${vp} ${gp}`; break;
	}
	
	aanschrijfwijze = capitalize(opschonen(aanschrijfwijze));
	
	return aanschrijfwijze;
}

function aanschrijfwijzeAanspreekvorm (persoon) {
	if (gebruikHoffelijkheidstitel(persoon)) {
		return aanspreekvorm(persoon.partners[0].naam, persoon.geslacht);
	}

	if (gebruikAdellijkeAanspreekvorm(persoon)) {
		return aanspreekvorm(persoon.naam, persoon.geslacht);
	}

	return null;
}

function aanschrijfwijze (persoon) {
	if (geldigeNaam(persoon) === false) { return null }

	persoon.partners = [ naamgebruikPartner(persoon.partners) ]
	if (geldigePartnernaam(persoon) === false) { 
		persoon.naam.aanduidingNaamgebruik.code = 'E';
		persoon.partners = [];
	}

	let naam = aanschrijfwijzeNaam(persoon);
	if (naam == null) { return null }

	let aanschrijfwijze = { naam: naam }
	let aanspreekvorm = aanschrijfwijzeAanspreekvorm(persoon);
	if (aanspreekvorm !== null) {
			aanschrijfwijze.aanspreekvorm = aanspreekvorm;
	}

	return aanschrijfwijze;
}

function aanhef (persoon) {
	persoon.partners = [ naamgebruikPartner(persoon.partners) ]
	
	if (gebruikHoffelijkheidstitel(persoon)) {
		let aanhef = aanhefAdellijk(persoon.partners[0].naam, persoon.geslacht);
		if (aanhef != null) { return aanhef }
	}

	if (gebruikAdellijkeAanspreekvorm(persoon)) {
		let aanhef = aanhefAdellijk(persoon.naam, persoon.geslacht);
		if (aanhef != null) { return aanhef }
	}

	if (geldigeNaam(persoon) === false) { return null }

	if (geldigePartnernaam(persoon) === false) { 
		persoon.naam.aanduidingNaamgebruik.code = 'E';
		persoon.partners = [];
	}

	let ga = aanhefAanspreekvorm(persoon);
	let vl = voorletters(persoon.naam);
	let vv = voorvoegsel(persoon.naam);
	let gn = geslachtsnaam(persoon.naam);
	let vp = '';
	let gp = '';
	
	if (persoon.partners.length > 0) {
		vp = voorvoegsel(persoon.partners[0].naam);
		gp = geslachtsnaam(persoon.partners[0].naam);
	}
	
	let aanhef = '';
	if (persoon.geslacht.code == 'O') {
			switch (persoon.naam.aanduidingNaamgebruik.code) {
			case 'E': aanhef = 'Geachte ' + capitalize(opschonen(`${vl} ${vv} ${gn}`)); break;
			case 'V': aanhef = 'Geachte ' + capitalize(opschonen(`${vl} ${vp} ${gp}-${vv} ${gn}`)); break;
			case 'N': aanhef = 'Geachte ' + capitalize(opschonen(`${vl} ${vv} ${gn}-${vp} ${gp}`)); break;
			case 'P': aanhef = 'Geachte ' + capitalize(opschonen(`${vl} ${vp} ${gp}`)); break;
		}
	} else {
		switch (persoon.naam.aanduidingNaamgebruik.code) {
			case 'E': aanhef = `${ga} ` + capitalize(opschonen(`${vv} ${gn}`)); break;
			case 'V': aanhef = `${ga} ` + capitalize(opschonen(`${vp} ${gp}-${vv} ${gn}`)); break;
			case 'N': aanhef = `${ga} ` + capitalize(opschonen(`${vv} ${gn}-${vp} ${gp}`)); break;
			case 'P': aanhef = `${ga} ` + capitalize(opschonen(`${vp} ${gp}`)); break;
		}
	}
	
	return aanhef;
}

function gebruikInLopendeTekst(persoon) {
	if (geldigeNaam(persoon) === false) { return null }

	persoon.partners = [ naamgebruikPartner(persoon.partners) ]
	if (geldigePartnernaam(persoon) === false) { 
		persoon.naam.aanduidingNaamgebruik.code = 'E';
		persoon.partners = [];
	}
	
	let ga = lopendeTekstAanspreekvorm(persoon);
	let pk = predicaat(persoon);
	let at = titel(persoon.naam, persoon.geslacht);
	let vv = voorvoegsel(persoon.naam);
	let gn = geslachtsnaam(persoon.naam);
	let ht = '';
	let vp = '';
	let gp = '';
	
	if (persoon.partners.length > 0) {
		vp = voorvoegsel(persoon.partners[0].naam);
		gp = geslachtsnaam(persoon.partners[0].naam);
	}

	if (gebruikHoffelijkheidstitel(persoon)) {
		ht = titel(persoon.partners[0].naam, persoon.geslacht);
	}

	/* 
	De samengestelde naam begint met een hoofdletter wanneer 
		- de samengestelde wordt voorafgegaan door 'de heer' of 'mevrouw'
	  - geslacht is onbekend en de persoon heeft geen voornamen (dus geen voorletters)
	*/
	switch (persoon.naam.aanduidingNaamgebruik.code) {
		case 'E': if ((persoon.geslacht.code!='O' || ga == '') && pk + at == '' ) { vv = capitalize(vv) } break;
		case 'N': if ((persoon.geslacht.code!='O' || ga == '') && pk + at == '' ) { vv = capitalize(vv) } break;
		case 'V': if ((persoon.geslacht.code!='O' || ga == '') && ht == '' ) { vp = capitalize(vp) } break;
		case 'P': if ((persoon.geslacht.code!='O' || ga == '') && ht == '' ) { vp = capitalize(vp) } break;
	}

	// De geslachtsaanduiding ('de heer' of 'mevrouw' of voorletters) wordt niet opgenomen, 
	// wanneer de samengestelde naam begint met een adellijke titel of predicaat
	switch (persoon.naam.aanduidingNaamgebruik.code) {
		case 'E': if (pk + at != '') { ga = '' } break;
		case 'N': if (pk + at != '') { ga = '' } break;
		case 'V': if (ht !== '') { ga = '' } break;
		case 'P': if (ht !== '') { ga = '' } break;
	}

	let gebruikInLopendeTekst = '';
	switch (persoon.naam.aanduidingNaamgebruik.code) {
		case 'E': gebruikInLopendeTekst = `${ga}${pk}${at} ${vv} ${gn}`; break;
		case 'N': gebruikInLopendeTekst = `${ga}${pk}${at} ${vv} ${gn}-${ht} ${vp} ${gp}`; break;
		case 'V': gebruikInLopendeTekst = `${ga}${ht} ${vp} ${gp}-${pk}${at} ${vv} ${gn}`; break;
		case 'P': gebruikInLopendeTekst = `${ga}${ht} ${vp} ${gp}`; break;
	}

	return opschonen(gebruikInLopendeTekst);
}

module.exports = { aanschrijfwijze, aanhef, gebruikInLopendeTekst }
