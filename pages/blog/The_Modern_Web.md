# package.json

As I have been on this wonderful journey of learning the vastness of programming,
be it squeezing out milliseconds and microseconds on function calls, or handling
user input in a graceful and modular way, there is one aspect of development that
I have struggled to come to terms with: package managers.

It may be my hubris that makes me feel like somewhat of a sellout every time I reach
for a dependency in a project I am writing myself, or possibly it it my insatiable
thirst for knowledge that resents the opportunity to do so being stripped away from
me for the sake of ease. Regardless, with each import or use statement I type that
doesnt directly link to something I myself have written, a part of me feels less 
connected to the project I'm working on.

That isn't to say dependencies *arent* useful, they are, especially in the case of
lower level languages like Rust or C, where you're given close to the bare minimum 
needed to talk with the metal and wire, and expected to make it sing an Opera.
Take Rust's `serde` package, which 