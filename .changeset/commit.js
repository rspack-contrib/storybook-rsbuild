const getVersionMessage = async (releasePlan) => {
  const publishableReleases = releasePlan.releases.filter(
    (release) => release.type !== 'none',
  )

  const newVersion = publishableReleases[0].newVersion

  return `release: v${newVersion}`
}

module.exports = { getVersionMessage }
