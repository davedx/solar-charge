# Solar Charger

Your easy-to-use charge EV from solar app.

## Why?

In August 2023, my energy supplier decided to add a new surcharge that applied to solar panel households who delivered energy to
the grid (_terugleveren_ in Dutch).[1] It is a laddered charge that increases the more energy you deliver. I ran the numbers, and for our installation, it would add up to an extra 3750 Euros over the lifetime of the panels. This does not seem like the best way to go about a sustainable energy transition, but on the other hand the imbalance costs to suppliers are real, and eventually net metering (_salderen_) in the Netherlands will be phased out. One solution to this issue is batteries, but they are expensive. So why not try cheaper -- or free -- solutions first? Enter the Solar Charger app.

![Screenshot 2023-09-02 at 16 28 46](https://github.com/davedx/solar-charge/assets/1479448/31db9c8f-55fb-4dde-bd49-5978cbd4ba2c)

## What?

The idea is simple: if you have an EV, charge it from the extra solar power you're generating. Ensure that you charge your EV in a way that avoids delivering solar energy to the grid, so you avoid the surcharge and possibly also pay for less electricity to charge your vehicle.

Home automation software isn't new and there are many solutions that can do this, but it usually tries to do many things and can be complicated to use. This app is designed to be as simple as humanly possible and do one thing well. It's a desktop app for MacOS and Windows with a mininum setup that runs all the time and manages charging your EV whenever it's plugged in.

Using data from your inverter, it will ensure all excess solar power is used to charge your EV, following the available power minute-per-minute throughout the day.

## What is supported?

As this is the first release, it currently only supports my inverter (**Omnik**) and vehicle (**Tesla model 3**). I plan to add support for more inverters as soon as possible.

## Is it free? Is it safe to use?

Yes, this app will stay free forever. It runs on your computer and uses your local network. It does not "phone home" or rely on any third party services except the website for your vehicle manufacturer to control charging.

I have tested this software extensively on my own vehicle, and the source code is simple, open, and free to read. No warranty of any kind is provided. [Read the full license.](LICENSE.md)

### Contributors

Me and mid

### References

1. [Original announcement](https://vandebron.nl/blog/vaste-terugleveringskosten) by my energy supplier, Vandebron
2. Research by Dutch newspaper AD finding [other suppliers have also quietly introduced extra surcharges](https://www.linkedin.com/feed/update/urn:li:activity:7100363234800459777/) for households with solar panels
3. My [LinkedIn post](https://www.linkedin.com/feed/update/urn:li:activity:7101495401525952512/) explaining my motivation for developing Solar Charger
