/* eslint-env mocha */
const assert = require('assert')
const TestHelper = require('../../../../../test-helper.js')

describe('/api/administrator/organizations/organizations', () => {
  describe('receives', () => {
    it('optional querystring offset (integer)', async () => {
      const offset = 1
      global.delayDiskWrites = true
      const administrator = await TestHelper.createOwner()
      const organizations = []
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        global.userProfileFields = ['contact-email', 'full-name']
        const user = await TestHelper.createUser()
        global.userProfileFields = ['display-email', 'display-name']
        await TestHelper.createProfile(user, {
          'display-name': user.profile.firstName,
          'display-email': user.profile.contactEmail
        })
        await TestHelper.createOrganization(user, {
          email: user.profile.displayEmail,
          name: 'My organization',
          profileid: user.profile.profileid
        })
        organizations.unshift(user.organization.organizationid)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/organizations?offset=${offset}`)
      req.account = administrator.account
      req.session = administrator.session
      const organizationsNow = await req.get()
      for (let i = 0, len = global.pageSize; i < len; i++) {
        assert.strictEqual(organizationsNow[i].organizationid, organizations[offset + i])
      }
    })

    it('optional querystring limit (integer)', async () => {
      const limit = 1
      const administrator = await TestHelper.createOwner()
      const organizations = []
      for (let i = 0, len = limit + 1; i < len; i++) {
        global.userProfileFields = ['contact-email', 'full-name']
        const user = await TestHelper.createUser()
        global.userProfileFields = ['display-email', 'display-name']
        await TestHelper.createProfile(user, {
          'display-name': user.profile.firstName,
          'display-email': user.profile.contactEmail
        })
        await TestHelper.createOrganization(user, {
          email: user.profile.displayEmail,
          name: 'My organization',
          profileid: user.profile.profileid
        })
        organizations.unshift(user.organization.organizationid)
      }
      const req = TestHelper.createRequest(`/api/administrator/organizations/organizations?limit=${limit}`)
      req.account = administrator.account
      req.session = administrator.session
      const organizationsNow = await req.get()
      assert.strictEqual(organizationsNow.length, limit)
    })

    it('optional querystring all (boolean)', async () => {
      const administrator = await TestHelper.createOwner()
      const organizations = []
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        global.userProfileFields = ['contact-email', 'full-name']
        const user = await TestHelper.createUser()
        global.userProfileFields = ['display-email', 'display-name']
        await TestHelper.createProfile(user, {
          'display-name': user.profile.firstName,
          'display-email': user.profile.contactEmail
        })
        await TestHelper.createOrganization(user, {
          email: user.profile.displayEmail,
          name: 'My organization',
          profileid: user.profile.profileid
        })
        organizations.unshift(user.organization.organizationid)
      }
      const req = TestHelper.createRequest('/api/administrator/organizations/organizations?all=true')
      req.account = administrator.account
      req.session = administrator.session
      const organizationsNow = await req.get()
      assert.strictEqual(organizationsNow.length, organizations.length)
    })
  })

  describe('returns', () => {
    it('array', async () => {
      const administrator = await TestHelper.createOwner()
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        global.userProfileFields = ['contact-email', 'full-name']
        const owner = await TestHelper.createUser()
        const user = await TestHelper.createUser()
        global.userProfileFields = ['display-email', 'display-name']
        await TestHelper.createProfile(owner, {
          'display-name': owner.profile.firstName,
          'display-email': owner.profile.contactEmail
        })
        await TestHelper.createProfile(user, {
          'display-name': user.profile.firstName,
          'display-email': user.profile.contactEmail
        })
        await TestHelper.createOrganization(owner, {
          email: owner.profile.displayEmail,
          name: 'My organization',
          profileid: owner.profile.profileid
        })
        await TestHelper.createInvitation(owner)
        await TestHelper.acceptInvitation(user, owner)
      }
      const req = TestHelper.createRequest('/api/administrator/organizations/organizations')
      req.account = administrator.account
      req.session = administrator.session
      req.filename = __filename
      req.saveResponse = true
      const organizationsNow = await req.get()
      assert.strictEqual(organizationsNow.length, global.pageSize)
    })
  })

  describe('configuration', () => {
    it('environment PAGE_SIZE', async () => {
      global.pageSize = 3
      const administrator = await TestHelper.createOwner()
      for (let i = 0, len = global.pageSize + 1; i < len; i++) {
        global.userProfileFields = ['contact-email', 'full-name']
        const user = await TestHelper.createUser()
        global.userProfileFields = ['display-email', 'display-name']
        await TestHelper.createProfile(user, {
          'display-name': user.profile.firstName,
          'display-email': user.profile.contactEmail
        })
        await TestHelper.createOrganization(user, {
          email: user.profile.displayEmail,
          name: 'My organization',
          profileid: user.profile.profileid
        })
      }
      const req = TestHelper.createRequest('/api/administrator/organizations/organizations')
      req.account = administrator.account
      req.session = administrator.session
      const organizationsNow = await req.get()
      assert.strictEqual(organizationsNow.length, global.pageSize)
    })
  })
})
