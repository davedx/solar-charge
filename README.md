# Solar Charger

Your easy-to-use charge EV from solar app.

## Why?

In August 2023, my energy supplier decided to add a new surcharge that applied to solar panel households who delivered energy into
the grid (_terugleveren_ in Dutch).[1] It is a laddered charge that increases the more energy you deliver. I ran the numbers, and for our installation, it would add up to an extra 3750 Euros over the lifetime of the panels. This does not seem like the best way to go about a sustainable energy transition, but on the other hand, the imbalance costs to suppliers are real, and eventually net metering (_salderen_) in the Netherlands will be phased out anyway. One solution to this issue is of course batteries, but they are expensive, so why not try cheaper -- or free -- solutions first? Enter the Solar Charger app.

## What?

The idea is simple: if you have an EV, charge it from the extra solar power you're currently generating. Ensure that you charge your EV in a way that prevents delivering solar energy to the grid, so you avoid the surcharge and save money, and possibly pay for less electricity to charge your vehicle too.

Home automation software isn't new, and there are probably many solutions that could do this, but such software usually tries to be many things and can be complicated to use. This app is designed to be as simple as humanly possible. It's a desktop app for MacOS and Windows with a mininum setup that runs all the time and manages charging your EV whenever it's plugged in.

Using data from your inverter, it will ensure all excess solar power is used to charge your EV, following the available power minute-per-minute.

## What is supported?

As this is the first release, it currently only supports my inverter (**Omnik**) and vehicle (**Tesla model 3**). I plan to add support for more inverters as soon as possible.

## Is it really free? Is it safe to use?

Yes, this app will stay free forever. It runs on your computer and uses your local network. It does not "phone home" or rely on any third party services except the website for your vehicle manufacturer to control charging.

I have tested this software extensively on my own vehicle, and the source code is simple, open, and free to read. No warranty of any kind is provided. [Read the full license.](LICENSE.md)

## Contributors

Me and ♥mid♥

## References

1. [Original announcement](https://vandebron.nl/blog/vaste-terugleveringskosten) by my energy supplier, Vandebron
2. Research by Dutch newspaper AD finding [other suppliers have also quietly introduced extra surcharges](https://www.linkedin.com/feed/update/urn:li:activity:7100363234800459777/) for households with solar panels
3. My [LinkedIn post](https://www.linkedin.com/feed/update/urn:li:activity:7101495401525952512/) explaining my motivation for developing Solar Charger
