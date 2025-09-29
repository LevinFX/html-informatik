(function createGameStateSingleton(global) {
	"use strict";

	// Simple, dependency-free state manager for the adventure game.
	// Usage in HTML:
	// <script src="../js/state.js"></script>
	// Then in any script: GameState.setLocation('phishing'); GameState.addTrace(1);

	var STORAGE_KEY = "abenteuer:state:v1";

	// In-memory fallback when localStorage is not available
	var memoryStorage = (function () {
		var store = {};
		return {
			getItem: function (k) { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; },
			setItem: function (k, v) { store[k] = String(v); },
			removeItem: function (k) { delete store[k]; }
		};
	})();

	function getStorage() {
		try {
			var testKey = "__storage_test__";
			global.localStorage.setItem(testKey, "1");
			global.localStorage.removeItem(testKey);
			return global.localStorage;
		} catch (e) {
			return memoryStorage;
		}
	}

	var storage = getStorage();

	var defaultState = function () {
		return {
			// Core
			location: null,
			traceLevel: 0,
			flags: {},
			startedAt: Date.now(),
			updatedAt: Date.now(),
			// Game-specific simple structure
			toolset: [],
			files: [],
			dbAccess: false,
			fwAccess: false,
			userAccess: false
		};
	};

	var listeners = [];
	var state = loadUnsafe() || defaultState();

	function clampTrace(value) {
		if (typeof value !== "number" || isNaN(value)) return 0;
		if (value < 0) return 0;
		if (value > 1000000) return 1000000; // absurd upper bound guard
		return Math.floor(value);
	}

	function notify() {
		for (var i = 0; i < listeners.length; i++) {
			try { listeners[i](getState()); } catch (e) { /* ignore listener errors */ }
		}
	}

	function saveInternal() {
		try {
			state.updatedAt = Date.now();
			storage.setItem(STORAGE_KEY, JSON.stringify(state));
			return true;
		} catch (e) {
			return false;
		}
	}

	function loadUnsafe() {
		try {
			var raw = storage.getItem(STORAGE_KEY);
			if (!raw) return null;
			var parsed = JSON.parse(raw);
			if (!parsed || typeof parsed !== "object") return null;
			// Shallow migrate missing fields
			parsed.flags = parsed.flags && typeof parsed.flags === "object" ? parsed.flags : {};
			parsed.traceLevel = clampTrace(parsed.traceLevel);
			// Ensure requested versatile fields exist with sane defaults
			if (!Array.isArray(parsed.toolset)) parsed.toolset = [];
			if (!Array.isArray(parsed.files)) parsed.files = [];
			parsed.dbAccess = !!parsed.dbAccess;
			parsed.fwAccess = !!parsed.fwAccess;
			parsed.userAccess = !!parsed.userAccess;
			return parsed;
		} catch (e) {
			return null;
		}
	}

	function getState() {
		// Return a shallow clone to prevent accidental external mutation
		return {
			location: state.location,
			traceLevel: state.traceLevel,
			flags: Object.assign({}, state.flags),
			startedAt: state.startedAt,
			updatedAt: state.updatedAt,
			toolset: Array.isArray(state.toolset) ? state.toolset.slice(0) : [],
			files: Array.isArray(state.files) ? state.files.slice(0) : [],
			dbAccess: !!state.dbAccess,
			fwAccess: !!state.fwAccess,
			userAccess: !!state.userAccess
		};
	}

	function setLocation(newLocation) {
		state.location = newLocation || null;
		saveInternal();
		notify();
	}

	function getLocation() {
		return state.location;
	}

	function setTraceLevel(value) {
		state.traceLevel = clampTrace(value);
		saveInternal();
		notify();
	}

	function addTrace(delta) {
		var next = clampTrace(state.traceLevel + (typeof delta === "number" ? delta : 0));
		if (next === state.traceLevel) return state.traceLevel;
		state.traceLevel = next;
		saveInternal();
		notify();
		return state.traceLevel;
	}

	function clearTrace() {
		if (state.traceLevel === 0) return 0;
		state.traceLevel = 0;
		saveInternal();
		notify();
		return 0;
	}

	// Generic key-value helpers for versatility
	function get(key) {
		if (!key) return undefined;
		return Object.prototype.hasOwnProperty.call(state, key) ? state[key] : undefined;
	}

	function set(key, value) {
		if (!key) return;
		state[key] = value;
		saveInternal();
		notify();
	}

	function getList(key) {
		var list = get(key);
		return Array.isArray(list) ? list.slice(0) : [];
	}

	function addToList(key, value) {
		if (!key) return [];
		var list = Array.isArray(state[key]) ? state[key] : (state[key] = []);
		if (list.indexOf(value) === -1) {
			list.push(value);
			saveInternal();
			notify();
		}
		return list.slice(0);
	}

	function removeFromList(key, value) {
		if (!key) return [];
		var list = Array.isArray(state[key]) ? state[key] : (state[key] = []);
		var idx = list.indexOf(value);
		if (idx !== -1) {
			list.splice(idx, 1);
			saveInternal();
			notify();
		}
		return list.slice(0);
	}

	function setFlag(name, value) {
		if (!name) return;
		state.flags[name] = value === undefined ? true : !!value;
		saveInternal();
		notify();
	}

	function getFlag(name) {
		return !!state.flags[name];
	}

	function toggleFlag(name) {
		if (!name) return false;
		var next = !state.flags[name];
		state.flags[name] = next;
		saveInternal();
		notify();
		return next;
	}

	function save() {
		return saveInternal();
	}

	function load() {
		var loaded = loadUnsafe();
		if (loaded) {
			state = loaded;
			notify();
			return true;
		}
		return false;
	}

	function reset() {
		state = defaultState();
		saveInternal();
		notify();
	}

	function onChange(listener) {
		if (typeof listener !== "function") return function () {};
		listeners.push(listener);
		// Return unsubscribe
		return function off() {
			for (var i = 0; i < listeners.length; i++) {
				if (listeners[i] === listener) {
					listeners.splice(i, 1);
					break;
				}
			}
		};
	}

	var api = {
		// Core
		getState: getState,
		reset: reset,
		save: save,
		load: load,
		onChange: onChange,
		// Generic accessors
		get: get,
		set: set,
		getList: getList,
		addToList: addToList,
		removeFromList: removeFromList,
		// Location
		setLocation: setLocation,
		getLocation: getLocation,
		// Trace level
		getTraceLevel: function () { return state.traceLevel; },
		setTraceLevel: setTraceLevel,
		addTrace: addTrace,
		clearTrace: clearTrace,
		// Flags
		setFlag: setFlag,
		getFlag: getFlag,
		toggleFlag: toggleFlag
	};

	// Expose globally for simple script include
	global.GameState = api;

	// Auto-load from storage on first include (no-op if nothing stored)
	load();

})(typeof window !== "undefined" ? window : this);


