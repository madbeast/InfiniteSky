// This file is part of InfiniteSky.
// Copyright (c) InfiniteSky Dev Teams - Licensed under GNU GPL
// For more information, see LICENCE in the main folder

// Loads the ItemInfo data

// Incase we ever make an editor we could have constructor?
if (typeof(ItemInfo_Prototype) === 'undefined') {
	ItemInfo_Prototype = {};
}

function ItemInfo(){}
ItemInfo.prototype = ItemInfo_Prototype;

ItemInfo_Prototype.inspect = safeguard_cli.inspect;

ItemInfo_Prototype.use = function(socket) {
	console.log('ItemType: '+this.ItemType);
	// Check item type, only useable items can be used.
	if ([
		 // Put Allowed TypeID's here
		 1, // Pill
		 2,
		 21 // Common
		].indexOf(this.ItemType) === -1
		) {
		socket.sendInfoMessage('This item cannot be used.');
		console.error('This item cannot be used.');
		return false;
		}
	
	// Apply item effects...
	socket.sendInfoMessage('Using items is not yet implemented.');
	// Ratio is actually %
	switch (this.ValueType) {
		case 1:  // HP Recovery Points
			socket.character.state.CurrentHP += this.Value1;
			if (socket.character.state.CurrentHP > socket.character.state.MaxHP) {
				socket.character.state.CurrentHP = socket.character.state.MaxHP;
			}
		break;
		case 2:  // HP Recovery Ratio
			socket.character.state.CurrentHP += Value1/100 * socket.character.state.MaxHP;
			if (socket.character.state.CurrentHP > socket.character.state.MaxHP) {
				socket.character.state.CurrentHP = socket.character.state.MaxHP;
			}
		break;
		case 3:  // Chi Recovery Points
			socket.character.state.CurrentChi += this.Value1;
			if (socket.character.state.CurrentChi > socket.character.state.MaxChi) {
				socket.character.state.CurrentChi = socket.character.state.MaxChi;
			}
		break;
		case 4:  // Chi Recovery Ratio
			socket.character.state.CurrentChi += Value1/100 * socket.character.state.MaxChi
			if (socket.character.state.CurrentChi > socket.character.state.MaxChi) {
				socket.character.state.CurrentChi = socket.character.state.MaxChi;
			}
		break;
		case 5:  // HP Recovery Ratio & Chi Recovery Ratio
			socket.character.state.CurrentHP += Value1/100 * socket.character.state.MaxHP;
			if (socket.character.state.CurrentHP > socket.character.state.MaxHP) {
				socket.character.state.CurrentHP = socket.character.state.MaxHP;
			}
			socket.character.state.CurrentChi += Value1/100 * socket.character.state.MaxChi
			if (socket.character.state.CurrentChi > socket.character.state.MaxChi) {
				socket.character.state.CurrentChi = socket.character.state.MaxChi;
			}
		break;
		//case 6:  // Activity Recovery Rate // Maybe for pet?
		//break;
		default:
			var message = 'Unhandled Item Value Type '+ValueType;
			dumpError(message);
			socket.sendInfoMessage(message);
		break;
	}

	// TODO: Use VM Scripts for item uses when special case.
	if (infos.Item.scripts && infos.Item.scripts[this.ID]) {
		return infos.Item.scripts[this.ID](socket);
	}
	return false;
};

ItemInfo_Prototype.getItemType = function() {
	var ItemType;
	switch (this.ItemType)
	{
		case 1: ItemType = 'Silver Coins'; // SilverCoins
		case 2: ItemType = 'Assist'; // Assist
		case 3: ItemType = 'Assist 2'; // Assist seems like its grouped to 2, It contains a different kind of pills,
			// couple books and enchanting mats of different quality
		case 4: ItemType = 'Mission';
		case 5: ItemType = 'Skill books / Art Book';
		case 6: ItemType = 'Calabash_Bottle'; //testing
		case 7: ItemType = 'Necklace';
		case 8: ItemType = 'Cape';
		case 9: ItemType = 'Armor';
		case 10: ItemType = 'Gloves';
		case 11: ItemType = 'Ring';
		case 12: ItemType = 'Boots';
		case 13: ItemType = 'Sword';
		case 14: ItemType = 'Blade';
		case 15: ItemType = 'Marble';
		case 16: ItemType = 'Katana';
		case 17: ItemType = 'Double Blade'; // test
		case 18: ItemType = 'Lute';
		case 19: ItemType = 'Light Blade';
		case 20: ItemType = 'Long Spear';
		case 21: ItemType = 'Scepter';
		case 22: ItemType = 'Pet';
		case 23: ItemType = 'Assist 3'; // Seems like crafting materials at herb master
		default: ItemType = 'Common'; break;
	};
	return ItemType;
};

ItemInfo_Prototype.getRareness = function() {
	var Rareness;
	switch (this.Rareness)
	{
		case 0: Rareness = 'Common'; break;
		case 1: Rareness = 'Uncommon'; break;
		case 2: Rareness = 'Unique'; break;
		case 3: Rareness = 'Rare'; break;
		case 4: Rareness = 'Elite'; break;
	}
	return Rareness;
};

ItemInfo_Prototype.toString = function(kind) {
	switch (kind) {
		case 'small':
			return this.ID+' - '+this.Name;
  break;
		case 'raretype':
			return this.ID+' - '+this.Name+' ('+this.getRareness()+')'+' '+this.getItemType();
		break;
  default:
			return this.ID+' - '+this.Name+' ('+this.getRareness()+')'+' '+this.getItemType()+' B:'+this.PurchasePrice+' S:'+this.SalePrice+' Lv:'+this.LevelRequirement;
		break;
	}
};

ItemInfo_Prototype.getSlotCount = function() {
	var t = this.ItemType;
    if (t === 2 || t === 7 || t === 11) {
        return 1;
    } else {
        return 4;
    }
};

ItemInfo_Prototype.isAllowedByClan = function(characterClanID){
	//TODO: Check up on actuall clan restriction value from Item Info
	if(this.Clan === 1 || this.Clan === (characterClanID +2)) return true;
	return false;
};


LoadItemInfo = function() {
	// Could wrap in try catch and remove infos.Item if failed load for some error in structure etc/
	infos.Item = new GameInfoLoader('005_00002.IMG',
restruct.
  int32lu("ID").
  string('Name',28).
  int32lu("Rareness").
  int32lu("ItemType").
  int32lu("DisplayItem2D").
  int32lu("_1").
  int32lu("Level"). // Double as LevelRequirement?
  int32lu("Clan").
  int32lu("_4").
  int32lu("_5").
  int32lu("_6").
  int32lu("_7").
  int32lu("_8").
  int32lu("_9").
  int32lu("_10").
  int32lu("_11").
  int32lu("_12").
  int32lu("PurchasePrice").
  int32lu("SalePrice").
  int32lu("_13").
  int32lu("Capacity").
  int32lu("LevelRequirement").
  int32lu("HonorPointReq").
  int32lu("_15a").
  int32ls("Strength").
  int32ls("Dexterity").
  int32ls("Vitality").
  int32ls("Chi").
  int32ls("Luck").
  int32ls("Damage").
  int32ls("Defense").
  int32ls("LightDamage").
  int32ls("ShadowDamage").
  int32ls("DarkDamage").
  int32ls("LightResistance").
  int32ls("ShawdowResistance").
  int32ls("DarkResistance").
  int32ls("ChancetoHit").
  int32ls("ChancetoDodge").
  int32ls("PercentToDeadlyBlow").
  int32ls("SkillBonusID1").
  int32ls("SkillBonusID2").
  int32ls("SkillBonusID3").
  int32ls("SkillBonusAmount1").
  int32ls("SkillBonusAmount2").
  int32ls("SkillBonusAmount3").
  int32ls("Stackable").
  int32ls("ValueType").
  int32ls("Value1").
  int32ls("_16").
  int32ls("_17").
  int32ls("Refinement").
  int32ls("ChancetoEarnExperiencePointsfromFinalhit").
  int32ls("ExperiencePointEarnedfromFinalhit_PERCENTBONUS_").
  int32ls("_18").
  int32ls("_19").
  int32ls("DecreaseChiConsumption").
  int32ls("DodgeDeadlyBlow").
  int32ls("IncreaseAllSKillMastery").
  int32ls("_20").
  int32ls("_21").
  int32ls("_22").
  int32ls("_23").
  string('Description1',25).
  string('Description2',25).
  string('Description3',26),
  function onRecordLoad(record) {
  	if (record.ID) {
  		// Change the prototype so that we have access to methods we want.
  		record.__proto__ = ItemInfo.prototype;
  	}
  	return record;
  });
};

// If we have not loaded the item info yet then load it
if (infos.Item === undefined) LoadItemInfo();

infos.Item.Type = {
	Common: 0,
	Silver: 1,
	Assist: 2,
	Assist2: 3,
	Mission: 4,
	SkillBook: 5,
	Bottle: 6,
	Necklace: 7,
	Cape: 8,
	Armor: 9,
	Gloves: 10,
	Ring: 11,
	Boots: 12,
	Sword: 13,
	Blade: 14,
	Marble: 15,
	Katana: 16,
	DoubleBlade: 17,
	Lute: 18,
	LightBlade: 19,
	LongSpear: 20,
	Scepter: 21,
	Pet: 22,
	Assist3: 23
};
