# lifxspace
LIFX web app for interacting with the Cloud API. It is built using Angular, Angular Material and it is hosted on github.io.

Accessible via [lifx.space](http://lifx.space)

##Features
- Interaction with single bulbs
- Set random colors
- Toggle bulb state
- Setting colors through HSB sliders
- Rotating preset scenes for individual bulbs

## TODO
- [x] Proper cookie handling once token is first setup.
- [x] Not allowing closing of token setup modal when clicking outside of it.
- [x] A better interface for the bulb list in the sidebar (group hierarchy).
- [x] Group support.
- [ ] Update slider values when a new bulb is selected.
- [ ] Button for cycling through random colors. 
- [ ] Passing existing token value to settings modal.
- [ ] Allowing the modal to be closed when a token is already setup.
- [ ] Scene support for groups of bulbs.
- [ ] Visual timeout/Blocking UI for 429 'Too Many Requests'.

## Update Log
### v1.2
- Group support
- Random Angular Material color scheme everytime page loads
- New labels for groups/bulbs
- Loading page correctly when token is first setup

###v1.1.1
- Fixing monster issue when no token is found

###v1.1
- Adding help modal
- Adding color picker
- Visual changes (HRs)

###v1.0
- Scenes, color selection through HSB, toggling for individual bulbs
- Token input
