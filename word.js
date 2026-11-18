 
        const storageKey = "listen-saved-reminders";
        const cards = [...document.querySelectorAll(".reminder-card")];
        const featuredQuote = document.querySelector(".v99_285");
        const featuredButton = document.querySelector("[data-save-featured]");
        const filterButtons = [...document.querySelectorAll("[data-filter]")];
        const moreButton = document.querySelector("[data-more-reminders]");
        const saved = new Set(JSON.parse(localStorage.getItem(storageKey) || "[]"));
        let currentFilter = "all";
        let nextIndex = 0;
        let extraShown = false;

        const save = () => localStorage.setItem(storageKey, JSON.stringify([...saved]));
        const cardText = (card) => card.querySelector(
          ".v103_21, .v103_27, .v103_33, .v103_40, .v103_46, .v103_52"
        ).textContent.trim();
        const setSaveButton = (button, isSaved) => {
          button.setAttribute("aria-pressed", String(isSaved));
          button.textContent = isSaved ? "♥ Saved" : button.hasAttribute("data-save-featured")
            ? "♡ Save reminder"
            : "♡ Save";
        };
        const refreshSavedState = () => {
          cards.forEach((card) => {
            const text = cardText(card);
            setSaveButton(card.querySelector("[data-save-card]"), saved.has(text));
          });
          setSaveButton(featuredButton, saved.has(featuredQuote.textContent.trim()));
          updateCards();
        };
        const updateCards = () => {
          cards.forEach((card) => {
            const matchesFilter = currentFilter === "all" ||
              (currentFilter === "saved" ? saved.has(cardText(card)) : card.dataset.category === currentFilter);
            card.hidden = !matchesFilter;
          });
        };

        document.addEventListener("click", (event) => {
          const button = event.target.closest("button");
          if (!button) return;

          const saveButton = button.closest("[data-save-card], [data-save-featured]");
          if (saveButton) {
            const text = saveButton.hasAttribute("data-save-featured")
              ? featuredQuote.textContent.trim()
              : cardText(saveButton.closest(".reminder-card"));
            if (saved.has(text)) saved.delete(text);
            else saved.add(text);
            save();
            refreshSavedState();
            return;
          }

          if (button.hasAttribute("data-filter")) {
            currentFilter = button.dataset.filter;
            filterButtons.forEach((filterButton) => {
              const active = filterButton === button;
              filterButton.setAttribute("aria-pressed", String(active));
              filterButton.classList.toggle("is-active", active);
            });
            updateCards();
            return;
          }

          if (button.hasAttribute("data-next-reminder")) {
            const quote = cards[nextIndex % cards.length];
            featuredQuote.textContent = cardText(quote);
            nextIndex += 1;
            refreshSavedState();
            return;
          }

          if (button.hasAttribute("data-more-reminders")) {
            if (!extraShown) {
              const more = [
                ["heavy", "“You can take things one breath, one moment, at a time.”"],
                ["kindness", "“You deserve patience, especially from yourself.”"],
                ["starting", "“Small steps still move you forward.”"]
              ];
              const extraGrid = document.createElement("div");
              extraGrid.className = "v103_18 extra-reminders";
              more.forEach(([category, quote]) => {
                const card = document.createElement("article");
                card.className = "v103_19 reminder-card";
                card.dataset.category = category;
                card.innerHTML = '<span class="v103_20">A GENTLE REMINDER</span>' +
                  '<span class="v103_21"></span><div class="v103_22">' +
                  '<span class="v103_23">A little reminder from LISTEN</span>' +
                  '<button class="v103_24 save-button" type="button" data-save-card aria-pressed="false">♡ Save</button></div>';
                card.querySelector(".v103_21").textContent = quote;
                extraGrid.append(card);
              });
              document.querySelector(".v103_56").before(extraGrid);
              cards.push(...extraGrid.querySelectorAll(".reminder-card"));
              extraShown = true;
              moreButton.textContent = "That’s enough for now ↑";
              refreshSavedState();
              extraGrid.scrollIntoView({ behavior: "smooth", block: "center" });
            } else {
              document.querySelector(".extra-reminders").remove();
              cards.splice(6);
              extraShown = false;
              moreButton.textContent = "A few more gentle words ↓";
              refreshSavedState();
            }
          }
        });

        document.querySelectorAll('a[href="#saved-reminders"]').forEach((link) => {
          link.addEventListener("click", () => {
            filterButtons.find((button) => button.dataset.filter === "saved").click();
          });
        });

        filterButtons[0].classList.add("is-active");
        refreshSavedState();
      
