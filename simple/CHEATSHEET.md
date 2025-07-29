# Regex Racer Cheat Sheet 🏎️

## Basic Patterns

| Symbol | Description | Example | Matches |
|--------|-------------|---------|---------|
| `.` | Any single character | `c.t` | "cat", "cut", "c@t" |
| `\d` | Any digit | `\d+` | "123", "456" |
| `\w` | Any word character (letter, number, underscore) | `\w+` | "abc", "123", "abc_123" |
| `\s` | Any whitespace character | `\s` | " ", tab, newline |
| `[abc]` | Character class - matches any one listed | `[aeiou]` | "a", "e", "i", "o", "u" |
| `[a-z]` | Character range | `[a-z]+` | "hello", "world" |

## Quantifiers

| Symbol | Description | Example | Matches |
|--------|-------------|---------|---------|
| `+` | One or more | `\d+` | "1", "123", "5555" |
| `*` | Zero or more | `ab*c` | "ac", "abc", "abbbc" |
| `?` | Zero or one (optional) | `colou?r` | "color", "colour" |
| `{n}` | Exactly n times | `\d{3}` | "123", "456" |
| `{n,m}` | Between n and m times | `\d{2,4}` | "12", "123", "1234" |

## Common Patterns

| Task | Pattern | Matches |
|------|---------|---------|
| Letters only | `[a-zA-Z]+` | "Hello", "World" |
| Numbers only | `\d+` | "123", "456" |
| Phone number | `\d{3}-\d{3}-\d{4}` | "123-456-7890" |
| Email (simple) | `\w+@\w+\.\w+` | "user@domain.com" |
| Time (24hr) | `\d{2}:\d{2}` | "13:45", "09:30" |

## Tips
1. Start with simpler patterns and build up
2. Use `^` at start and `$` at end to match whole string
3. Test your pattern as you type
4. Watch for special characters that need escaping
5. The game adds `^` and `$` automatically - just write the pattern!
