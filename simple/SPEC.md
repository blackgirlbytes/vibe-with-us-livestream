# Regex Racer - Simple Implementation

## Overview
Regex Racer is a typing game that teaches regex patterns through gameplay. Players must type the correct regex pattern to match given text before time runs out.

## Core Gameplay
- Player is presented with a text string
- Player must type the correct regex pattern to match it
- Timer counts down from 30 seconds
- Score increases for each correct pattern
- Game ends when timer reaches 0

## Minimal Feature Set
1. Single game screen
2. Text display area for target string
3. Input field for regex pattern
4. Real-time pattern matching feedback
5. Basic scoring system
6. Simple timer

## Level 1 Patterns (MVP)
- Match exact text: `hello`
- Match digits: `\d`
- Match letters: `[a-z]`
- Match multiple characters: `+`
- Match optional characters: `?`

## Future Enhancements (Not in MVP)
- Multiple levels
- Power-ups
- Special effects
- Difficulty settings
- High scores
