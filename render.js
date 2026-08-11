(function () {

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function fetchJSON(path) {
    return fetch(path).then(function (res) {
      if (!res.ok) throw new Error('Failed to load ' + path);
      return res.json();
    });
  }

  function studioPickCard(s) {
    var mediumAttr = s.medium.join(' ');
    if (s.status === 'coming-soon') {
      return '<div class="studio-pick-card is-disabled" data-medium="' + esc(mediumAttr) + '">'
        + '<div class="photo-frame photo-frame-top ar-4-3">'
        + '<span class="coming-soon-badge">Coming Soon</span>'
        + '<img src="' + esc(s.image) + '" alt="' + esc(s.imageAlt) + '" loading="lazy">'
        + '</div>'
        + '<div class="studio-pick-body">'
        + '<h3>' + esc(s.name) + '</h3>'
        + '<p>' + esc(s.pickerSubtitle) + '</p>'
        + '<span class="studio-pick-cta is-disabled-cta">Opening soon</span>'
        + '</div></div>';
    }
    return '<a href="' + esc(s.classesLink || 'classes.html') + '" class="studio-pick-card" data-medium="' + esc(mediumAttr) + '">'
      + '<div class="photo-frame photo-frame-top ar-4-3"><img src="' + esc(s.image) + '" alt="' + esc(s.imageAlt) + '" loading="lazy"></div>'
      + '<div class="studio-pick-body">'
      + '<h3>' + esc(s.name) + '</h3>'
      + '<p>' + esc(s.pickerSubtitle) + '</p>'
      + '<span class="studio-pick-cta">See classes <span aria-hidden="true">&rarr;</span></span>'
      + '</div></a>';
  }

  function studioCard(s) {
    if (s.status === 'coming-soon') {
      return '<div class="card studio-card is-disabled" style="padding:0;">'
        + '<div class="photo-frame ar-4-3"><span class="coming-soon-badge">Coming Soon</span><img src="' + esc(s.image) + '" alt="' + esc(s.imageAlt) + '" loading="lazy"></div>'
        + '<div style="padding:24px 32px 32px; display:flex; flex-direction:column; gap:10px;">'
        + '<span class="tag">' + esc(s.tag) + '</span>'
        + '<h3>' + esc(s.name) + '</h3>'
        + '<p>' + esc(s.description) + '</p>'
        + '<p class="meta-row">Coming soon &middot; <a href="mailto:' + esc(s.interestEmail) + '?subject=' + encodeURIComponent(s.interestSubject || '') + '" class="text-link">Join the interest list</a></p>'
        + '</div></div>';
    }
    return '<div class="card studio-card" style="padding:0;">'
      + '<div class="photo-frame ar-4-3"><img src="' + esc(s.image) + '" alt="' + esc(s.imageAlt) + '" loading="lazy"></div>'
      + '<div style="padding:24px 32px 32px; display:flex; flex-direction:column; gap:10px;">'
      + '<span class="tag tag-clay">' + esc(s.tag) + '</span>'
      + '<h3>' + esc(s.name) + '</h3>'
      + '<p>' + esc(s.description) + '</p>'
      + '<address>' + esc(s.address) + '<br>' + esc(s.phone) + ' &middot; <a href="mailto:' + esc(s.email) + '" class="text-link">' + esc(s.email) + '</a></address>'
      + '<p class="meta-row"><strong>Hours</strong> ' + esc(s.hours) + '</p>'
      + '</div></div>';
  }

  function renderStudioPicker(studios) {
    var mount = document.getElementById('studio-picker-mount');
    if (!mount) return;
    mount.innerHTML = studios.map(studioPickCard).join('');
  }

  function renderStudioGrid(studios) {
    var mount = document.getElementById('studio-grid-mount');
    if (!mount) return;
    mount.innerHTML = studios.map(studioCard).join('');
  }

  function renderStudioDirectory(studios) {
    var list = document.getElementById('studio-directory-mount');
    var select = document.getElementById('studio-select-mount');
    var open = studios.filter(function (s) { return s.status === 'open'; });
    if (list) {
      list.innerHTML = open.map(function (s) {
        return '<li><div><h4>' + esc(s.name) + '</h4><p style="margin:0;color:var(--ink-70);font-size:.92rem;">' + esc(s.address) + '</p></div>'
          + '<div class="meta-row" style="margin:0;">' + esc(s.phone) + '<br><a href="mailto:' + esc(s.email) + '" class="text-link">' + esc(s.email) + '</a></div></li>';
      }).join('');
    }
    if (select) {
      select.innerHTML = open.map(function (s) { return '<option>' + esc(s.name) + '</option>'; }).join('');
    }
  }

  function renderClasses(data) {
    var sixWeek = document.getElementById('six-week-mount');
    var short = document.getElementById('short-session-mount');
    if (sixWeek) {
      sixWeek.innerHTML = data.sixWeekCourses.map(function (c) {
        return '<li><div><span class="tag">' + esc(c.level) + '</span><h3 style="margin-top:.4em;">' + esc(c.name) + '</h3>'
          + '<p style="margin:0; color:var(--ink-70);">' + esc(c.description) + '</p></div>'
          + '<div><span class="price">' + esc(c.price) + '</span><p class="meta-row">' + esc(c.duration) + '</p></div></li>';
      }).join('');
    }
    if (short) {
      short.innerHTML = data.shortSessions.map(function (c) {
        return '<div class="card" style="padding:0;">'
          + '<div class="photo-frame ar-1-1"><img src="' + esc(c.image) + '" alt="' + esc(c.imageAlt) + '" loading="lazy"></div>'
          + '<div style="padding:24px 28px 32px;"><span class="tag">' + esc(c.level) + '</span><h3>' + esc(c.name) + '</h3>'
          + '<p>' + esc(c.description) + '</p><p class="price">' + esc(c.price) + ' <small>' + esc(c.duration) + '</small></p></div></div>';
      }).join('');
    }
  }

  function renderMembership(data) {
    var g = document.getElementById('membership-general-mount');
    if (!g) return;
    document.getElementById('membership-general-desc').textContent = data.general.description;
    document.getElementById('membership-general-rows').innerHTML = data.general.rows.map(function (r) {
      return '<tr><td>' + esc(r.term) + '</td><td class="num">' + esc(r.individual) + '</td><td class="num">' + esc(r.family) + '</td></tr>';
    }).join('');
    document.getElementById('membership-woodshop-desc').textContent = data.woodshop.description;
    document.getElementById('membership-woodshop-rows').innerHTML = data.woodshop.rows.map(function (r) {
      return '<tr><td>' + esc(r.term) + '</td><td class="num">' + esc(r.price) + '</td></tr>';
    }).join('');
    document.getElementById('membership-artist-desc').textContent = data.workingArtist.description;
    document.getElementById('membership-artist-rows').innerHTML = data.workingArtist.rows.map(function (r) {
      return '<tr><td>' + esc(r.term) + '</td><td class="num">' + esc(r.price) + '</td></tr>';
    }).join('');
  }

  function renderWorkshops(data) {
    var rec = document.getElementById('workshops-recurring-mount');
    var up = document.getElementById('workshops-upcoming-mount');
    if (rec) {
      rec.innerHTML = data.recurring.map(function (w) {
        return '<div class="card"><span class="tag tag-clay">Ongoing</span><h3>' + esc(w.name) + '</h3><p>' + esc(w.description) + '</p>'
          + '<p class="meta-row"><strong>' + esc(w.time) + '</strong> &middot; ' + esc(w.schedule) + '</p></div>';
      }).join('');
    }
    if (up) {
      up.innerHTML = data.upcoming.map(function (w) {
        return '<li><div><h3 style="margin-bottom:.2em;">' + esc(w.name) + '</h3><p style="margin:0; color:var(--ink-70);">' + esc(w.description) + '</p></div>'
          + '<div class="meta-row" style="margin:0;">' + esc(w.dates) + '<br>' + esc(w.location) + '</div></li>';
      }).join('');
    }
  }

  function teamCard(p) {
    return '<div class="card"><span class="tag tag-clay">' + esc(p.code) + '</span><h3>' + esc(p.name) + '</h3><p>' + esc(p.description) + '</p>'
      + '<p class="price">' + esc(p.price) + ' <small>' + esc(p.unit) + '</small></p></div>';
  }

  function renderTeamEvents(data) {
    var clay = document.getElementById('team-clay-mount');
    var wood = document.getElementById('team-wood-mount');
    if (clay) clay.innerHTML = data.clayPackages.map(teamCard).join('');
    if (wood) wood.innerHTML = data.woodworkingPackages.map(teamCard).join('');
  }

  function renderKids(data) {
    var mount = document.getElementById('kids-mount');
    if (!mount) return;
    mount.innerHTML = data.programs.map(function (k) {
      var metaLine = k.price
        ? '<p class="price">' + esc(k.price) + ' <small>' + esc(k.unit) + '</small></p>'
        : '<p class="meta-row"><strong>' + esc((k.meta || '').split(' · ')[0] || '') + '</strong> &middot; ' + esc((k.meta || '').split(' · ')[1] || '') + '</p>';
      return '<div class="card" style="padding:0;">'
        + '<div class="photo-frame ar-4-3"><img src="' + esc(k.image) + '" alt="' + esc(k.imageAlt) + '" loading="lazy"></div>'
        + '<div style="padding:24px 28px 32px;"><span class="tag tag-clay">' + esc(k.tag) + '</span><h3>' + esc(k.name) + '</h3>'
        + '<p>' + esc(k.description) + '</p>' + metaLine + '</div></div>';
    }).join('');
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('studio-picker-mount') || document.getElementById('studio-grid-mount') || document.getElementById('studio-directory-mount') || document.getElementById('studio-select-mount')) {
      fetchJSON('content/studios.json').then(function (data) {
        var studios = data.studios;
        renderStudioPicker(studios);
        renderStudioGrid(studios);
        renderStudioDirectory(studios);
      }).catch(function (e) { console.error(e); });
    }
    if (document.getElementById('six-week-mount') || document.getElementById('short-session-mount')) {
      fetchJSON('content/classes.json').then(renderClasses).catch(function (e) { console.error(e); });
    }
    if (document.getElementById('membership-general-mount')) {
      fetchJSON('content/membership.json').then(renderMembership).catch(function (e) { console.error(e); });
    }
    if (document.getElementById('workshops-recurring-mount') || document.getElementById('workshops-upcoming-mount')) {
      fetchJSON('content/workshops.json').then(renderWorkshops).catch(function (e) { console.error(e); });
    }
    if (document.getElementById('team-clay-mount') || document.getElementById('team-wood-mount')) {
      fetchJSON('content/team-events.json').then(renderTeamEvents).catch(function (e) { console.error(e); });
    }
    if (document.getElementById('kids-mount')) {
      fetchJSON('content/kids.json').then(renderKids).catch(function (e) { console.error(e); });
    }
  });

})();
